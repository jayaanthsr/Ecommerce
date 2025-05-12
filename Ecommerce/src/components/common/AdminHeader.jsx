import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, LayoutDashboard, Package, ShoppingCart } from 'lucide-react';
import '../../styles/Header.css';

const AdminHeader = ({ onLogout }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    useEffect(() => {
        setMobileMenuOpen(false); // close on route change
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

    return (
        <header className={`main-header ${scrolled ? 'scrolled' : ''}`}>
            <div className="header-container">
                <Link to="/admin" className="header-logo">
                    <ShoppingBag size={24} className="logo-icon" />
                    <span className="logo-text">Bharath Admin</span>
                </Link>

                <nav className={`main-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    <NavLink to="/admin" className="nav-item" end>
                        <LayoutDashboard size={18} className="nav-icon" />
                        Dashboard
                    </NavLink>
                    <NavLink to="/admin/products" className="nav-item">
                        <Package size={18} className="nav-icon" />
                        Products
                    </NavLink>
                    <NavLink to="/admin/orders" className="nav-item">
                        <ShoppingCart size={18} className="nav-icon" />
                        Orders
                    </NavLink>
                </nav>

                <div className="header-actions">
                    <button onClick={handleLogout} className="logout-btn nav-item">Logout</button>

                    <button
                        className="mobile-menu-button"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
