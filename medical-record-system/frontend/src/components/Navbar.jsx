import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <nav className="navbar">

            <Link to="/" className="logo">
                MedChain
            </Link>

            <div className="nav-links">

                {user?.role === "doctor" && (
                    <>
                        <Link to="/doctor">
                            Dashboard
                        </Link>

                        <Link to="/upload">
                            Upload Record
                        </Link>
                    </>
                )}

                {user?.role === "patient" && (
                    <Link to="/patient">
                        Dashboard
                    </Link>
                )}

                <Link to="/blockchain">
                    Blockchain
                </Link>

                <button onClick={logout}>
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;