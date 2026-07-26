import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function PatientDashboard() {

    const [records, setRecords] = useState([]);
    const [message, setMessage] = useState("");

    const loadRecords = async () => {

        try {

            const response = await API.get(
                "/records/patient"
            );

            setRecords(response.data.records);

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {
        loadRecords();
    }, []);

    const downloadRecord = async (id, fileName) => {

        try {

            setMessage("Verifying record integrity...");

            const response = await API.get(
                `/records/${id}/download`,
                {
                    responseType: "blob"
                }
            );

            const blob = new Blob(
                [response.data],
                {
                    type: "application/pdf"
                }
            );

            const url = window.URL.createObjectURL(
                blob
            );

            const link =
                document.createElement("a");

            link.href = url;
            link.download = fileName;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            setMessage(
                "Integrity verified. Record downloaded successfully."
            );

        } catch (error) {

            setMessage(
                "Record verification failed."
            );
        }
    };

    return (
        <>
            <Navbar />

            <main className="dashboard">

                <h1>Patient Dashboard</h1>

                <p>
                    Your secure medical records
                </p>

                {message && (
                    <div className="info-box">
                        {message}
                    </div>
                )}

                <h2>My Medical Records</h2>

                {records.length === 0 ? (

                    <div className="empty">
                        No medical records available.
                    </div>

                ) : (

                    <div className="records-grid">

                        {records.map((record) => (

                            <div
                                className="record-card"
                                key={record._id}
                            >

                                <h3>
                                    {record.fileName}
                                </h3>

                                <p>
                                    Doctor:{" "}
                                    {record.doctorId?.name}
                                </p>

                                <p>
                                    Date:{" "}
                                    {new Date(
                                        record.createdAt
                                    ).toLocaleDateString()}
                                </p>

                                <p className="hash">
                                    SHA-256:{" "}
                                    {record.hash?.substring(0, 20)}
                                    ...
                                </p>

                                <button
                                    onClick={() =>
                                        downloadRecord(
                                            record._id,
                                            record.fileName
                                        )
                                    }
                                >
                                    Verify & Download
                                </button>

                            </div>

                        ))}

                    </div>

                )}

            </main>
        </>
    );
}

export default PatientDashboard;