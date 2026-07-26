import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function UploadRecord() {

    const navigate = useNavigate();

    const [patientId, setPatientId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [file, setFile] = useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // debounce timer
    let searchTimer = null;

    const fetchPatients = async (q) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(
                `http://localhost:5000/api/patients?q=${encodeURIComponent(q)}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (!res.ok) {
                setSearchResults([]);
                return;
            }
            const body = await res.json();
            setSearchResults(body.patients || []);
        } catch (err) {
            console.error(err);
            setSearchResults([]);
        }
    };

    const handleSearchChange = (e) => {
        const v = e.target.value;
        setSearchQuery(v);
        if (searchTimer) clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            if (v.trim()) fetchPatients(v.trim());
            else setSearchResults([]);
        }, 300);
    };

    const selectPatient = (p) => {
        setPatientId(p._id);
        setSearchQuery(`${p.name} <${p.email}>`);
        setSearchResults([]);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        if (!file) {
            setError("Please select a PDF file.");
            return;
        }

        if (!patientId && !searchQuery) {
            setError("Please select a patient from the list or enter their email/ID.");
            return;
        }

        const formData = new FormData();

        // If user entered an email (contains @) use that; otherwise use the selected ID
        if (searchQuery.includes('@') && !patientId) {
            formData.append('patientId', searchQuery);
        } else {
            formData.append('patientId', patientId);
        }

        formData.append('medicalFile', file);

        try {
            const token = localStorage.getItem('token');

            const res = await fetch('http://localhost:5000/api/records/upload', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (!res.ok) {
                const er = await res.json();
                throw new Error(er.message || 'Upload failed');
            }

            setMessage('Record uploaded, encrypted and added to blockchain.');

            setPatientId('');
            setSearchQuery('');
            setFile(null);
            document.getElementById('medicalFile').value = '';

        } catch (error) {
            setError(error.message || 'Upload failed');
        }
    };

    return (
        <>
            <Navbar />

            <main className="form-page">

                <div className="form-card">

                    <h1>Upload Medical Record</h1>

                    <p>
                        The file will be encrypted before
                        being stored.
                    </p>

                    {message && (
                        <div className="success">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <label>
                            Search Patient (name or email)
                        </label>

                        <input
                            type="text"
                            placeholder="Type to search patients by name or email"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            autoComplete="off"
                        />

                        {searchResults.length > 0 && (
                            <ul className="search-results">
                                {searchResults.map((p) => (
                                    <li key={p._id} onClick={() => selectPatient(p)}>
                                        {p.name} — {p.email}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <small>
                            Selected ID: {patientId || 'none'} — you can also paste the patient's email here and upload directly.
                        </small>

                        <label>
                            Medical PDF
                        </label>

                        <input
                            id="medicalFile"
                            type="file"
                            accept=".pdf"
                            onChange={(e) =>
                                setFile(e.target.files[0])
                            }
                            required
                        />

                        <button type="submit">
                            Encrypt & Upload
                        </button>

                    </form>

                    <button
                        className="secondary-button"
                        onClick={() =>
                            navigate("/doctor")
                        }
                    >
                        Back to Dashboard
                    </button>

                </div>

            </main>
        </>
    );
}

export default UploadRecord;