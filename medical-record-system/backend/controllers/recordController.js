const mongoose = require("mongoose");
const MedicalRecord = require("../models/MedicalRecord");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

const {
    encryptFile,
    decryptFile
} = require("../services/encryptionService");

const {
    generateHash
} = require("../services/hashingService");

const {
    addBlock
} = require("./blockchainController");

const uploadRecord = async (req, res) => {
    try {
        if (req.user.role !== "doctor") {
            return res.status(403).json({
                message: "Only doctors can upload medical records"
            });
        }

        const {
            patientId: rawPatientId,
            patientID,
            patient,
            patient_id,
            patientEmail
        } = req.body;

        const patientIdValue =
            (rawPatientId || patientID || patient || patient_id || patientEmail || "").toString().trim();

        if (!patientIdValue) {
            return res.status(400).json({
                message: "Patient ID or patient identifier is required"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a file"
            });
        }

        const patientQuery = { role: "patient" };

        if (mongoose.isValidObjectId(patientIdValue)) {
            patientQuery._id = patientIdValue;
        } else if (patientIdValue.includes("@")) {
            patientQuery.email = patientIdValue;
        } else {
            return res.status(400).json({
                message: "Invalid patient identifier. Provide a valid patient ID or email."
            });
        }

        const patientRecord = await User.findOne(patientQuery);

        if (!patientRecord) {
            return res.status(404).json({
                message: "Patient not found. Verify the patient identifier or patient ID."
            });
        }

        // Read uploaded file
        const originalFile = fs.readFileSync(req.file.path);
        const fileHash = generateHash(originalFile);

        const encryptionKeyHex = process.env.ENCRYPTION_KEY;

        if (!encryptionKeyHex || encryptionKeyHex.length !== 64) {
            return res.status(500).json({
                message: "Server encryption key is not configured correctly"
            });
        }

        const encryptionKey = Buffer.from(encryptionKeyHex, "hex");

        const {
            encryptedData,
            iv
        } = encryptFile(originalFile, encryptionKey);

        const encryptedFileName = `encrypted-${Date.now()}.enc`;
        const encryptedFilePath = path.join(
            path.resolve(__dirname, "../uploads"),
            encryptedFileName
        );

        fs.writeFileSync(encryptedFilePath, encryptedData);
        fs.unlinkSync(req.file.path);

        const record = await MedicalRecord.create({
            patientId: patientRecord._id,
            doctorId: req.user.id,
            fileName: req.file.originalname,
            encryptedFilePath,
            iv,
            hash: fileHash
        });

const block = await addBlock(
    record._id,
    fileHash
);
    res.status(201).json({
    message: "Medical record encrypted and added to blockchain",
    record,
    block
});

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to upload medical record",
            error: error.message
        });
    }
};


const getPatientRecords = async (req, res) => {
    try {
        const records = await MedicalRecord.find({
            patientId: req.user.id
        })
        .populate("doctorId", "name email")
        .sort({ createdAt: -1 });

        res.json({
            records
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch records",
            error: error.message
        });
    }
};


const getDoctorRecords = async (req, res) => {
    try {
        const records = await MedicalRecord.find({
            doctorId: req.user.id
        })
        .populate("patientId", "name email")
        .sort({ createdAt: -1 });

        res.json({
            records
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch records",
            error: error.message
        });
    }
};

const downloadRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const record = await MedicalRecord.findById(id);

        if (!record) {
            return res.status(404).json({
                message: "Medical record not found"
            });
        }

        // Patient can access only their own records
        if (
            req.user.role === "patient" &&
            record.patientId.toString() !== req.user.id
        ) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        // Read encrypted file
        const encryptedFile = fs.readFileSync(
            record.encryptedFilePath
        );

        const encryptionKey = Buffer.from(
            process.env.ENCRYPTION_KEY,
            "hex"
        );

        // Decrypt
        const decryptedFile = decryptFile(
            encryptedFile,
            record.iv,
            encryptionKey
        );

        // Generate hash again
        const newHash = generateHash(decryptedFile);

        // Compare hashes
        const integrityVerified =
            newHash === record.hash;

        if (!integrityVerified) {
            return res.status(400).json({
                message: "File integrity verification failed",
                integrityVerified: false
            });
        }

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${record.fileName}"`
        );

        res.send(decryptedFile);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to download record",
            error: error.message
        });
    }
};


module.exports = {
    uploadRecord,
    getPatientRecords,
    getDoctorRecords,
    downloadRecord
};