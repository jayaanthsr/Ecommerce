import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/Navbar.css";
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        // Check login status
        const loggedStatus = sessionStorage.getItem("isLogged");
        setIsLoggedIn(loggedStatus === "user");

        // You could fetch cart count here if you have an API for it
        // For now, let's set a placeholder
        if (loggedStatus === "user") {
            // Example: This would be replaced with an actual API call
            // fetchCartCount(sessionStorage.getItem("userName"));
            setCartCount(3); // Placeholder count
        }
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Implement search functionality - could navigate to a search results page
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("isLogged");
        sessionStorage.removeItem("userName");
        setIsLoggedIn(false);
        setCartCount(0);
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Mobile menu button */}
                <div className="mobile-menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </div>

                {/* Logo */}
                <div className="navbar-logo">
                    <Link to="/">
                        <span className="logo-icon">🛒</span>
                        <span className="logo-text">MyStore</span>
                    </Link>
                </div>

                {/* Search bar */}
                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="search-button">
                        <FaSearch />
                    </button>
                </form>

                {/* Navigation links */}
                <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                    <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                    <li><Link to="/products" onClick={() => setIsMenuOpen(false)}>All Products</Link></li>
                    <li className="dropdown">
                        <span>Categories</span>
                        <div className="dropdown-content">
                            <Link to="/category/electronics">Electronics</Link>
                            <Link to="/category/clothing">Clothing</Link>
                            <Link to="/category/home">Home & Kitchen</Link>
                            <Link to="/category/books">Books</Link>
                        </div>
                    </li>
                    <li><Link to="/deals" onClick={() => setIsMenuOpen(false)}>Deals</Link></li>
                </ul>

                {/* User actions */}
                <div className="navbar-actions">
                    <div className="cart-container">
                        <Link to="/cart" className="cart-icon">
                            <FaShoppingCart />
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </Link>
                    </div>

                    <div className="user-container">
                        <FaUser />
                        {isLoggedIn ? (
                            <div className="user-dropdown">
                                <p className="greeting">Hello, {sessionStorage.getItem("userName")}</p>
                                <Link to="/account">My Account</Link>
                                <Link to="/orders">My Orders</Link>
                                <button onClick={handleLogout} className="logout-button">Log Out</button>
                            </div>
                        ) : (
                            <div className="user-dropdown">
                                <Link to="/login" className="login-button">Sign In</Link>
                                <div className="register-prompt">
                                    New customer? <Link to="/register">Register</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;