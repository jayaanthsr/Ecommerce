import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import '../../styles/Header.css';

const AdminHeader = ({ onLogout }) => {
  return (
      <header className="header">
        <div className="header-container">
          <Link to="/" className="header-logo">
            <ShoppingBag size={24} />
            <span>Bharath Admin</span>
          </Link>

          <nav className="header-nav">
            <NavLink to="/admin" className="nav-link">Dashboard</NavLink>
            <NavLink to="/admin/products" className="nav-link">Products</NavLink>
            <NavLink to="/admin/orders" className="nav-link">Orders</NavLink>
            <button onClick={onLogout} className="nav-link logout-btn">Logout</button>
          </nav>
        </div>
      </header>
  );
};

export default AdminHeader;
