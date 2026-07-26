import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Blockchain() {

    const [blocks, setBlocks] = useState([]);
    const [error, setError] = useState("");

    const loadBlockchain = async () => {

        try {

            const response = await API.get(
                "/blockchain"
            );

            setBlocks(
                response.data.blockchain
            );

        } catch (error) {

            setError(
                "Unable to load blockchain."
            );
        }
    };

    useEffect(() => {
        loadBlockchain();
    }, []);

    return (
        <>
            <Navbar />

            <main className="dashboard">

                <h1>Blockchain Ledger</h1>

                <p>
                    Each medical record is linked using
                    cryptographic hashes.
                </p>

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                <div className="blockchain">

                    {blocks.map((block) => (

                        <div
                            className="block"
                            key={block._id}
                        >

                            <div className="block-header">

                                <h2>
                                    Block #{block.index}
                                </h2>

                                <span>
                                    {new Date(
                                        block.timestamp
                                    ).toLocaleString()}
                                </span>

                            </div>

                            <p>
                                <strong>Record ID:</strong>{" "}
                                {block.recordId?._id}
                            </p>

                            <p>
                                <strong>File Hash:</strong>
                            </p>

                            <code>
                                {block.fileHash}
                            </code>

                            <p>
                                <strong>Previous Hash:</strong>
                            </p>

                            <code>
                                {block.previousHash}
                            </code>

                            <p>
                                <strong>Block Hash:</strong>
                            </p>

                            <code>
                                {block.hash}
                            </code>

                            {block.index <
                                blocks.length && (
                                <div className="chain-arrow">
                                    ↓
                                </div>
                            )}

                        </div>

                    ))}

                </div>

            </main>
        </>
    );
}

export default Blockchain;