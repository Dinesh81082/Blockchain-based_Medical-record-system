const crypto = require("crypto");

const algorithm = "aes-256-cbc";

const encryptFile = (buffer, key) => {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
        algorithm,
        key,
        iv
    );

    const encrypted = Buffer.concat([
        cipher.update(buffer),
        cipher.final()
    ]);

    return {
        encryptedData: encrypted,
        iv: iv.toString("hex")
    };
};

const decryptFile = (encryptedData, iv, key) => {
    const decipher = crypto.createDecipheriv(
        algorithm,
        key,
        Buffer.from(iv, "hex")
    );

    const decrypted = Buffer.concat([
        decipher.update(encryptedData),
        decipher.final()
    ]);

    return decrypted;
};

module.exports = {
    encryptFile,
    decryptFile
};