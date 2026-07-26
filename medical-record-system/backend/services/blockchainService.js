const crypto = require("crypto");

const calculateHash = (
    index,
    timestamp,
    recordId,
    fileHash,
    previousHash
) => {
    return crypto
        .createHash("sha256")
        .update(
            index +
            timestamp +
            recordId +
            fileHash +
            previousHash
        )
        .digest("hex");
};


const createBlock = (
    index,
    recordId,
    fileHash,
    previousHash
) => {
    const timestamp = new Date().toISOString();

    const hash = calculateHash(
        index,
        timestamp,
        recordId.toString(),
        fileHash,
        previousHash
    );

    return {
        index,
        timestamp,
        recordId,
        fileHash,
        previousHash,
        hash
    };
};


module.exports = {
    calculateHash,
    createBlock
};