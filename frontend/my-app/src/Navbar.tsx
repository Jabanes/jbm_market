import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem("token"));
    const navigate = useNavigate();

    // Function to check login status
    const checkLoginStatus = () => {
        setIsLoggedIn(!!localStorage.getItem("token"));
    };

    useEffect(() => {
        // Check on component mount
        checkLoginStatus();

        // Poll localStorage every second
        const interval = setInterval(checkLoginStatus, 1000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">FreshCart</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        {isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/orders">My Orders</Link>

                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/cart">Cart</Link>

                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-link nav-link" onClick={handleLogout}>
                                        Logout
                                    </button>

                                </li>
                                
                            </>


                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
