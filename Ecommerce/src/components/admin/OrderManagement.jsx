import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, MoreHorizontal, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { orderApi } from '../../api/api';
import '../../styles/OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState({});
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Using mock data until backend is ready

        const response = await orderApi.getAllOrders();
        setOrders(response.data);



        // Initialize order details state
        const detailsState = {};
        orders.forEach(order => {
          detailsState[order.id] = false;
        });
        setOrderDetailsOpen(detailsState);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);

      // Update order status locally
      setOrders(prevOrders =>
          prevOrders.map(order =>
              order.id === orderId ? { ...order, status: newStatus } : order
          )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };


  // Filter and sort orders
  const filteredAndSortedOrders = () => {
    let result = [...orders];
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(order => 
        order.status.toLowerCase() === statusFilter.toLowerCase());
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.orderNumber.toLowerCase().includes(query) || 
        `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase().includes(query) ||
        order.customer.email.toLowerCase().includes(query)
      );
    }
    
    // Sort orders
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'date':
          aValue = new Date(a.orderDate);
          bValue = new Date(b.orderDate);
          break;
        case 'total':
          aValue = a.total;
          bValue = b.total;
          break;
        case 'customer':
          aValue = `${a.customer.firstName} ${a.customer.lastName}`.toLowerCase();
          bValue = `${b.customer.firstName} ${b.customer.lastName}`.toLowerCase();
          break;
        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return result;
  };
  
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  const toggleOrderDetails = (orderId) => {
    setOrderDetailsOpen({
      ...orderDetailsOpen,
      [orderId]: !orderDetailsOpen[orderId]
    });
  };
  
  // const updateOrderStatus = async (orderId, newStatus) => {
  //   try {
  //
  //     await orderApi.updateOrderStatus(orderId, newStatus);
  //
  //
  //
  //   } catch (error) {
  //     console.error('Error updating order status:', error);
  //   }
  // };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };
  
  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }
  
  return (
    <div className="order-management">
      <h1 className="page-title">Order Management</h1>
      
      <div className="management-controls">
        <div className="search-input-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <Filter size={16} className="filter-icon" />
          <select 
            value={statusFilter} 
            onChange={handleStatusFilterChange}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th></th>
              <th 
                className={`sortable ${sortField === 'orderNumber' ? 'active' : ''}`}
                onClick={() => handleSort('orderNumber')}
              >
                <div className="sort-header">
                  <span>Order ID</span>
                  {sortField === 'orderNumber' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th 
                className={`sortable ${sortField === 'customer' ? 'active' : ''}`}
                onClick={() => handleSort('customer')}
              >
                <div className="sort-header">
                  <span>Customer</span>
                  {sortField === 'customer' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th 
                className={`sortable ${sortField === 'date' ? 'active' : ''}`}
                onClick={() => handleSort('date')}
              >
                <div className="sort-header">
                  <span>Date</span>
                  {sortField === 'date' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th 
                className={`sortable ${sortField === 'total' ? 'active' : ''}`}
                onClick={() => handleSort('total')}
              >
                <div className="sort-header">
                  <span>Total</span>
                  {sortField === 'total' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th 
                className={`sortable ${sortField === 'status' ? 'active' : ''}`}
                onClick={() => handleSort('status')}
              >
                <div className="sort-header">
                  <span>Status</span>
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedOrders().map(order => (
              <React.Fragment key={order.id}>
                <tr>
                  <td className="expand-cell">
                    <button
                      className="expand-btn"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      {orderDetailsOpen[order.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </td>
                  <td className="order-id">{order.orderNumber}</td>
                  <td className="customer-cell">
                    <div className="customer-name">
                      {order.customer.firstName} {order.customer.lastName}
                    </div>
                    <div className="customer-email">{order.customer.email}</div>
                  </td>
                  <td>{formatDate(order.orderDate)}</td>
                  <td className="order-total">${order.total.toFixed(2)}</td>
                  <td>
                    <span className={`order-status ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div className="order-actions">
                      <button className="action-btn view-btn">
                        <Eye size={16} />
                      </button>
                      <div className="dropdown">
                        <button className="dropdown-btn">
                          <MoreHorizontal size={16} />
                        </button>
                        <div className="dropdown-content">
                          {order.status !== 'Pending' && (
                            <button onClick={() => updateOrderStatus(order.id, 'Pending')}>
                              Mark as Pending
                            </button>
                          )}
                          {order.status !== 'Processing' && (
                            <button onClick={() => updateOrderStatus(order.id, 'Processing')}>
                              Mark as Processing
                            </button>
                          )}
                          {order.status !== 'Shipped' && (
                            <button onClick={() => updateOrderStatus(order.id, 'Shipped')}>
                              Mark as Shipped
                            </button>
                          )}
                          {order.status !== 'Delivered' && (
                            <button onClick={() => updateOrderStatus(order.id, 'Delivered')}>
                              Mark as Delivered
                            </button>
                          )}
                          {order.status !== 'Cancelled' && (
                            <button onClick={() => updateOrderStatus(order.id, 'Cancelled')}>
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                {orderDetailsOpen[order.id] && (
                  <tr className="order-details-row">
                    <td colSpan="7">
                      <div className="order-details">
                        <div className="details-grid">
                          <div className="details-section customer-details">
                            <h3>Customer Details</h3>
                            <div className="details-content">
                              <p><strong>Name:</strong> {order.customer.firstName} {order.customer.lastName}</p>
                              <p><strong>Email:</strong> {order.customer.email}</p>
                              <p><strong>Address:</strong> {order.customer.address}</p>
                              <p><strong>City:</strong> {order.customer.city}</p>
                              <p><strong>ZIP Code:</strong> {order.customer.zipCode}</p>
                              <p><strong>Country:</strong> {order.customer.country}</p>
                            </div>
                          </div>
                          
                          <div className="details-section payment-details">
                            <h3>Payment Details</h3>
                            <div className="details-content">
                              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                              <p><strong>Subtotal:</strong> ${order.subtotal.toFixed(2)}</p>
                              <p><strong>Shipping:</strong> ${order.shipping.toFixed(2)}</p>
                              <p><strong>Tax:</strong> ${order.tax.toFixed(2)}</p>
                              <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="order-items-section">
                          <h3>Order Items</h3>
                          <div className="order-items-list">
                            {order.items.map(item => (
                              <div key={item.id} className="order-item">
                                <div className="item-image">
                                  <img src={item.image} alt={item.name} />
                                </div>
                                <div className="item-details">
                                  <div className="item-name">{item.name}</div>
                                  <div className="item-price">${item.price.toFixed(2)} x {item.quantity}</div>
                                </div>
                                <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="order-status-actions">
                          <h3>Update Status</h3>
                          <div className="status-buttons">
                            <button 
                              className={`status-btn ${order.status === 'Pending' ? 'active' : ''}`}
                              onClick={() => updateOrderStatus(order.id, 'Pending')}
                              disabled={order.status === 'Pending'}
                            >
                              Pending
                            </button>
                            <button 
                              className={`status-btn ${order.status === 'Processing' ? 'active' : ''}`}
                              onClick={() => updateOrderStatus(order.id, 'Processing')}
                              disabled={order.status === 'Processing'}
                            >
                              Processing
                            </button>
                            <button 
                              className={`status-btn ${order.status === 'Shipped' ? 'active' : ''}`}
                              onClick={() => updateOrderStatus(order.id, 'Shipped')}
                              disabled={order.status === 'Shipped'}
                            >
                              Shipped
                            </button>
                            <button 
                              className={`status-btn ${order.status === 'Delivered' ? 'active' : ''}`}
                              onClick={() => updateOrderStatus(order.id, 'Delivered')}
                              disabled={order.status === 'Delivered'}
                            >
                              Delivered
                            </button>
                            <button 
                              className={`status-btn cancel-btn ${order.status === 'Cancelled' ? 'active' : ''}`}
                              onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                              disabled={order.status === 'Cancelled'}
                            >
                              Cancelled
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;