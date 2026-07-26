const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const authMiddleware = require("../middleware/authMiddleware");

const {
    uploadRecord,
    getPatientRecords,
    getDoctorRecords,
    downloadRecord
} = require("../controllers/recordController");

const router = express.Router();

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + file.originalname;

        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage
});


// Doctor uploads medical record
router.post(
    "/upload",
    authMiddleware,
    upload.single("medicalFile"),
    uploadRecord
);


// Patient gets own records
router.get(
    "/patient",
    authMiddleware,
    getPatientRecords
);


// Doctor gets uploaded records
router.get(
    "/doctor",
    authMiddleware,
    getDoctorRecords
);

router.get(
    "/:id/download",
    authMiddleware,
    downloadRecord
);


module.exports = router;