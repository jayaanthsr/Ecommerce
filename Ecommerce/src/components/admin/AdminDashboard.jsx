import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, PieChart, DollarSign, Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [period, setPeriod] = useState('week');

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  return (
      <div className="admin-dashboard">
        <h1 className="page-title">Admin Dashboard</h1>


        <div className="dashboard-grid">
          <div className="dashboard-card revenue-chart">


          </div>

          <div className="dashboard-card sales-by-category">
            <div className="card-header">
              <h2 className="card-title">Sales by Category</h2>
            </div>
            <div className="chart-container">
              <div className="chart-placeholder">
                <PieChart size={48} />
                <p className="chart-note">Category sales pie chart would render here using a charting library</p>
              </div>
            </div>
          </div>

          <div className="dashboard-card recent-orders">
            <div className="card-header">
              <h2 className="card-title">Recent Orders</h2>
              <Link to="/admin/orders" className="view-all">View All</Link>
            </div>
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No order data available</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-card quick-actions">
            <div className="card-header">
              <h2 className="card-title">Quick Actions</h2>
            </div>
            <div className="action-buttons">
              <Link to="/admin/products" className="action-button">
                <Package size={20} />
                <span>Manage Products</span>
              </Link>
              <Link to="/admin/orders" className="action-button">
                <ShoppingCart size={20} />
                <span>Manage Orders</span>
              </Link>
              <button className="action-button">
                <Users size={20} />
                <span>View Customers</span>
              </button>
              <button className="action-button">
                <BarChart size={20} />
                <span>Generate Reports</span>
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AdminDashboard;
