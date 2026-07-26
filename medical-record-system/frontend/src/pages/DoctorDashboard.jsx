import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function DoctorDashboard() {

    const [records, setRecords] = useState([]);

    const loadRecords = async () => {

        try {

            const response = await API.get(
                "/records/doctor"
            );

            setRecords(response.data.records);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadRecords();
    }, []);

    return (
        <>
            <Navbar />

            <main className="dashboard">

                <div className="dashboard-header">

                    <div>
                        <h1>Doctor Dashboard</h1>
                        <p>
                            Manage your patients' medical records.
                        </p>
                    </div>

                    <Link
                        to="/upload"
                        className="button"
                    >
                        + Upload Record
                    </Link>

                </div>

                <div className="info-box">
                    <strong>Security:</strong>

                    <span>
                        Records are encrypted using AES-256,
                        hashed using SHA-256 and linked to the
                        blockchain.
                    </span>
                </div>

                <h2>Uploaded Records</h2>

                {records.length === 0 ? (

                    <div className="empty">
                        No records uploaded yet.
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
                                    Patient:{" "}
                                    {record.patientId?.name}
                                </p>

                                <p>
                                    Email:{" "}
                                    {record.patientId?.email}
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

                            </div>

                        ))}

                    </div>

                )}

            </main>
        </>
    );
}

export default DoctorDashboard;