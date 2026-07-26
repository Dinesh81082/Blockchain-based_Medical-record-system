const Block = require("../models/Block");
const { createBlock } = require("../services/blockchainService");


const addBlock = async (recordId, fileHash) => {
    const lastBlock = await Block.findOne()
        .sort({ index: -1 });

    let index = 1;
    let previousHash = "0";

    if (lastBlock) {
        index = lastBlock.index + 1;
        previousHash = lastBlock.hash;
    }

    const newBlock = createBlock(
        index,
        recordId,
        fileHash,
        previousHash
    );

    return await Block.create(newBlock);
};


const getBlockchain = async (req, res) => {
    try {
        const blocks = await Block.find()
            .populate("recordId")
            .sort({ index: 1 });

        res.json({
            success: true,
            blockchain: blocks
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch blockchain",
            error: error.message
        });
    }
};


module.exports = {
    addBlock,
    getBlockchain
};