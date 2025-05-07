import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import '../../styles/Header.css';

const UserHeader = ({ cartItems, onLogout }) => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const userRole = localStorage.getItem('userRole');

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-logo">
                    <ShoppingBag size={24} />
                    <span>Bharath Electronics</span>
                </Link>

                <nav className="header-nav">
                    <NavLink to="/" className="nav-link">Home</NavLink>
                    <NavLink to="/orders" className="nav-link">My Orders</NavLink>
                    <NavLink to="/cart" className="nav-link cart-link">
                        <ShoppingCart size={20} />
                        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                    </NavLink>
                    {userRole==='user'
                        ? <button onClick={onLogout} className="nav-link logout-btn">Logout</button>
                        : <NavLink to="/login" className="nav-link logout-btn">Login</NavLink>
                    }
                </nav>
            </div>
        </header>
    );
};

export default UserHeader;
