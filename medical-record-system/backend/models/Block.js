const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema(
    {
        index: {
            type: Number,
            required: true
        },

        timestamp: {
            type: Date,
            required: true
        },

        recordId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MedicalRecord",
            required: true
        },

        fileHash: {
            type: String,
            required: true
        },

        previousHash: {
            type: String,
            required: true
        },

        hash: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Block", blockSchema);