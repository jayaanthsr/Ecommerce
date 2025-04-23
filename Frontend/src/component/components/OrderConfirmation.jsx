import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./styles/OrderConfirmation.css";

function OrderConfirmation() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!orderId) {
            navigate("/");
            return;
        }

        fetchOrderDetails();
    }, [orderId, navigate]);

    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/orders/${orderId}`);
            setOrder(response.data);
        } catch (error) {
            toast.error("Failed to fetch order details");
            console.error("Error fetching order:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    };

    if (isLoading) {
        return (
            <div className="confirmation-container loading">
                <div className="loader"></div>
                <p>Loading order details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="confirmation-container error">
                <h2>Order Not Found</h2>
                <p>We couldn't find the order you're looking for.</p>
                <button className="btn-primary" onClick={() => navigate("/")}>
                    Return to Home
                </button>
            </div>
        );
    }

    return (
        <div className="confirmation-container">
            <div className="confirmation-header">
                <div className="success-icon">✓</div>
                <h1>Order Confirmed!</h1>
                <p>Thank you for your purchase. Your order has been confirmed.</p>
            </div>

            <div className="order-info">
                <div className="order-info-item">
                    <span className="info-label">Order Number:</span>
                    <span className="info-value">{order.orderId}</span>
                </div>
                <div className="order-info-item">
                    <span className="info-label">Order Date:</span>
                    <span className="info-value">{formatDate(order.orderDate)}</span>
                </div>
                <div className="order-info-item">
                    <span className="info-label">Payment Method:</span>
                    <span className="info-value">
            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : `UPI (${order.upiId})`}
          </span>
                </div>
            </div>

            <div className="confirmation-section">
                <h2>Order Summary</h2>
                <div className="order-items">
                    {order.items.map((item) => (
                        <div className="order-item" key={item.id}>
                            <div className="item-image">
                                <img src={item.productImage} alt={item.productName} />
                            </div>
                            <div className="item-details">
                                <h3>{item.productName}</h3>
                                <p className="item-price">₹{item.productPrice.toLocaleString()} × {item.quantity}</p>
                            </div>
                            <div className="item-total">
                                ₹{(item.productPrice * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="order-totals">
                    <div className="total-row">
                        <span>Subtotal</span>
                        <span>₹{order.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="total-row">
                        <span>Shipping</span>
                        <span>FREE</span>
                    </div>
                    <div className="total-row total">
                        <span>Total</span>
                        <span>₹{order.totalAmount.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="confirmation-section">
                <h2>Shipping Information</h2>
                <div className="shipping-details">
                    <p><strong>{order.shippingInfo.fullName}</strong></p>
                    <p>{order.shippingInfo.address}</p>
                    <p>{order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.pincode}</p>
                    <p>Phone: {order.shippingInfo.phone}</p>
                    <p>Email: {order.shippingInfo.email}</p>
                </div>
            </div>

            <div className="confirmation-message">
                <p>A confirmation email has been sent to {order.shippingInfo.email}.</p>
                <p>If you have any questions about your order, please contact our customer support.</p>
            </div>

            <div className="confirmation-actions">
                <button className="btn-primary" onClick={() => navigate("/")}>
                    Continue Shopping
                </button>
                <button className="btn-secondary" onClick={() => navigate("/orders")}>
                    View All Orders
                </button>
            </div>
        </div>
    );
}

export default OrderConfirmation;