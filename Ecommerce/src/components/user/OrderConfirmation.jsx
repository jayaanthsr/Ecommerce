import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, ArrowRight } from 'lucide-react';
import { orderApi } from '../../api/api';
import '../../styles/OrderConfirmation.css';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {

        const response = await orderApi.getOrderById(id);
        setOrder(response.data);

      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id]);
  
  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }
  
  if (!order) {
    return (
      <div className="not-found">
        <h2>Order not found</h2>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="order-confirmation-container">
      <div className="confirmation-header">
        <div className="confirmation-icon">
          <CheckCircle size={48} />
        </div>
        <h1 className="confirmation-title">Your order has been confirmed!</h1>
        <p className="confirmation-message">
          Thank you for your purchase. We've sent a confirmation email to <strong>{order.customer.email}</strong>.
        </p>
      </div>
      
      <div className="order-details-card">
        <div className="order-summary-section">
          <h2 className="order-section-title">Order Summary</h2>
          <div className="order-meta">
            <div className="order-meta-item">
              <span className="meta-label">Order Number:</span>
              <span className="meta-value">{order.orderNumber}</span>
            </div>
            <div className="order-meta-item">
              <span className="meta-label">Order Date:</span>
              <span className="meta-value">{formatDate(order.orderDate)}</span>
            </div>
            <div className="order-meta-item">
              <span className="meta-label">Status:</span>
              <span className="meta-value status-confirmed">{order.status}</span>
            </div>
          </div>
        </div>
        
        <div className="order-items-section">
          <h2 className="order-section-title">Items Ordered</h2>
          <div className="order-items">
            {order.items.map(item => (
              <div key={item.id} className="order-item">
                <div className="order-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="order-item-details">
                  <div className="order-item-name">{item.name}</div>
                  <div className="order-item-meta">
                    <span className="order-item-quantity">Qty: {item.quantity}</span>
                    <span className="order-item-price">₹{item.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="order-item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="order-totals-section">
          <div className="order-totals">
            <div className="totals-row">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="totals-row">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? 'Free' : `₹₹{order.shipping.toFixed(2)}`}</span>
            </div>
            <div className="totals-row">
              <span>Tax</span>
              <span>₹{order.tax.toFixed(2)}</span>
            </div>
            <div className="totals-row total">
              <span>Total</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="shipping-payment-cards">
        <div className="info-card shipping-info">
          <h2 className="info-card-title">Shipping Information</h2>
          <div className="info-card-content">
            <div className="address">
              <strong>{order.customer.firstName} {order.customer.lastName}</strong><br />
              {order.customer.address}<br />
              {order.customer.city}, {order.customer.zipCode}<br />
              {order.customer.country}
            </div>
            
            <div className="delivery-estimate">
              <div className="delivery-icon">
                <Truck size={24} />
              </div>
              <div className="delivery-details">
                <div className="delivery-label">Estimated Delivery</div>
                <div className="delivery-date">{formatDate(order.estimatedDelivery)}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="info-card payment-info">
          <h2 className="info-card-title">Payment Information</h2>
          <div className="info-card-content">
            <div className="payment-method">
              <div className="payment-method-label">Payment Method:</div>
              <div className="payment-method-value">{order.payment.method}</div>
            </div>
            
            <div className="payment-card">
              <div className="payment-card-label">Card ending in:</div>
              <div className="payment-card-value">**** {order.payment.cardLastFour}</div>
            </div>
            
            <div className="payment-amount">
              <div className="payment-amount-label">Amount Paid:</div>
              <div className="payment-amount-value">₹{order.total.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="order-tracking">
        <h2 className="tracking-title">Track Your Order</h2>
        <div className="tracking-steps">
          <div className="tracking-step completed">
            <div className="step-icon">
              <CheckCircle size={24} />
            </div>
            <div className="step-content">
              <div className="step-title">Order Confirmed</div>
              <div className="step-date">{formatDate(order.orderDate)}</div>
            </div>
          </div>
          
          <div className="step-connector">
            <ArrowRight size={16} />
          </div>
          
          <div className="tracking-step">
            <div className="step-icon">
              <Package size={24} />
            </div>
            <div className="step-content">
              <div className="step-title">Order Processed</div>
              <div className="step-date">Pending</div>
            </div>
          </div>
          
          <div className="step-connector">
            <ArrowRight size={16} />
          </div>
          
          <div className="tracking-step">
            <div className="step-icon">
              <Truck size={24} />
            </div>
            <div className="step-content">
              <div className="step-title">Shipped</div>
              <div className="step-date">Pending</div>
            </div>
          </div>
          
          <div className="step-connector">
            <ArrowRight size={16} />
          </div>
          
          <div className="tracking-step">
            <div className="step-icon">
              <CheckCircle size={24} />
            </div>
            <div className="step-content">
              <div className="step-title">Delivered</div>
              <div className="step-date">Pending</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="confirmation-actions">
        <Link to="/orders" className="btn btn-secondary">
          View All Orders
        </Link>
        <Link to="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;