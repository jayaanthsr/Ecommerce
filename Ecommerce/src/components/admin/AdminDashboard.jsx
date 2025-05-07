import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Package, ShoppingCart, Users } from 'lucide-react';
import { orderApi } from '../../api/api';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [period, setPeriod] = useState('week');
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await orderApi.getAllOrders();
        const sortedOrders = response.data
            .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)) // newest first
            .slice(0, 10); // get top 10
        setRecentOrders(sortedOrders);
      } catch (error) {
        console.error("Failed to fetch recent orders", error);
      }
    };

    fetchRecentOrders();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Processing': return 'status-processing';
      case 'Shipped': return 'status-shipped';
      case 'Delivered': return 'status-delivered';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  return (
      <div className="admin-dashboard">
        <h1 className="page-title">Admin Dashboard</h1>

        <div className="dashboard-grid">
          {/* Revenue Chart Placeholder */}
          <div className="dashboard-card revenue-chart">
            {/* Future chart goes here */}
          </div>

          {/* Recent Orders */}
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
                {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center' }}>No order data available</td>
                    </tr>
                ) : (
                    recentOrders.map(order => (
                        <tr key={order.id}>
                          <td>{order.orderNumber}</td>
                          <td>{order.customer.firstName} {order.customer.lastName}</td>
                          <td>{new Date(order.orderDate).toLocaleString()}</td>
                          <td>${order.total.toFixed(2)}</td>
                          <td>
                        <span className={`order-status ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                          </td>
                        </tr>
                    ))
                )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
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
