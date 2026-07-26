const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
    getBlockchain
} = require("../controllers/blockchainController");

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    getBlockchain
);

module.exports = router;