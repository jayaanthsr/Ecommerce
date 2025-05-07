import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, ChevronRight, FileText } from 'lucide-react';
import { orderApi } from '../../api/api';
import '../../styles/UserOrders.css';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const email = localStorage.getItem('email'); // Make sure email is stored
        console.log("Email:", email);

        const response = await orderApi.getUserOrders(email); // Correct API call
        setOrders(response.data);
        console.log("Orders:", response.data);

      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'status-delivered';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };
  
  if (loading) {
    return <div className="loading">Loading your orders...</div>;
  }
  
  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <div className="empty-orders-icon">
          <ShoppingBag size={64} />
        </div>
        <h2>No orders yet</h2>
        <p>You haven't placed any orders yet. Start shopping to place your first order!</p>
        <Link to="/" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }
  
  return (
    <div className="user-orders-container">
      <h1 className="page-title">My Orders</h1>
      
      <div className="orders-search">
        <div className="search-input-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by order number or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="no-matching-orders">
          <p>No orders found matching your search. Try a different search term.</p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-number">
                  <div className="order-label">Order #:</div>
                  <div className="order-value">{order.orderNumber}</div>
                </div>
                
                <div className="order-date">
                  <div className="order-label">Placed on:</div>
                  <div className="order-value">{formatDate(order.orderDate)}</div>
                </div>
                
                <div className="order-status">
                  <div className="order-label">Status:</div>
                  <div className={`order-value ₹{getStatusClass(order.status)}`}>
                    {order.status}
                  </div>
                </div>
                
                <div className="order-total">
                  <div className="order-label">Total:</div>
                  <div className="order-value">₹{order.total.toFixed(2)}</div>
                </div>
                
                <Link to={`/order-confirmation/₹{order.id}`} className="order-details-link">
                  <span>Details</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
              
              <div className="order-items-preview">
                {order.items.slice(0, 3).map((item, index) => (
                  <div key={`₹{order.id}-₹{item.id}`} className="order-item-thumbnail">
                    <img src={item.image} alt={item.name} />
                  </div>
                ))}
                
                {order.items.length > 3 && (
                  <div className="order-item-more">
                    +{order.items.length - 3} more
                  </div>
                )}
              </div>
              
              <div className="order-actions">
                <Link to={`/order-confirmation/₹{order.id}`} className="btn btn-secondary btn-sm">
                  <FileText size={16} />
                  View Order
                </Link>
                
                {order.status === 'Delivered' && (
                  <button className="btn btn-primary btn-sm">
                    Buy Again
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;