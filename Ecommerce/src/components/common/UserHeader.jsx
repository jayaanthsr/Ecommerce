import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, Menu, X, Heart, Search } from 'lucide-react';
import '../../styles/Header.css';

const UserHeader = ({ cartItems, onLogout }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const totalItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const userRole = localStorage.getItem('userRole');
    const location = useLocation();

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        const button = e.currentTarget;
        button.classList.add('animate-pulse');
        setTimeout(() => {
            onLogout && onLogout();
        }, 300);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const toggleSearch = () => {
        setSearchOpen(!searchOpen);
    };

    return (
        <header className={`main-header ${scrolled ? 'scrolled' : ''}`}>
            <div className="header-container">
                <Link to="/" className="header-logo">
                    <ShoppingBag size={24} className="logo-icon" />
                    <span className="logo-text">Bharath Electronics</span>
                </Link>

                {/* Main Navigation */}
                <nav className={`main-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    <NavLink to="/" className="nav-item" end>Home</NavLink>
                    <NavLink to="#section-subtitle" className="nav-item">Products</NavLink>
                    <NavLink to="/orders" className="nav-item">My Orders</NavLink>
                </nav>

                <div className="header-actions">
                    <button className="action-button search-button" onClick={toggleSearch}>
                        <Search size={20} />
                    </button>

                    <Link to="/wishlist" className="action-button">
                        <Heart size={20} />
                    </Link>

                    <Link to="/cart" className="action-button cart-button">
                        <ShoppingCart size={20} />
                        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                    </Link>

                    {userRole === 'user' ? (
                        <button onClick={handleLogout} className="logout-btn nav-item">Logout</button>
                    ) : (
                        <Link to="/login" className="login-btn">Login</Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-button"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Search Overlay */}
            <div className={`search-overlay ${searchOpen ? 'active' : ''}`}>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search for products..."
                        className="search-input"
                        autoFocus={searchOpen}
                    />
                    <button className="search-close" onClick={toggleSearch}>
                        <X size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default UserHeader;
