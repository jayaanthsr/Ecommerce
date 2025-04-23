import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./Checkout.css";

function Checkout() {
    const navigate = useNavigate();
    const username = sessionStorage.getItem("userName");
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);

    const [shippingInfo, setShippingInfo] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [upiId, setUpiId] = useState("");

    useEffect(() => {
        if (!username) {
            toast.error("Please login to proceed with checkout");
            navigate("/login");
            return;
        }

        const storedItems = sessionStorage.getItem("checkoutItems");
        if (!storedItems) {
            toast.error("No items in checkout");
            navigate("/cart");
            return;
        }

        setCheckoutItems(JSON.parse(storedItems));
    }, [navigate, username]);

    const calculateTotal = () => {
        return checkoutItems.reduce((total, item) => {
            return total + (item.productPrice * item.quantity);
        }, 0);
    };

    const handleShippingInfoChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo({
            ...shippingInfo,
            [name]: value
        });
    };

    const validateShippingInfo = () => {
        const errors = [];

        if (!shippingInfo.fullName.trim()) errors.push("Full name is required");
        if (!shippingInfo.email.trim()) errors.push("Email is required");
        else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) errors.push("Email is invalid");
        if (!shippingInfo.phone.trim()) errors.push("Phone number is required");
        if (!shippingInfo.address.trim()) errors.push("Address is required");
        if (!shippingInfo.city.trim()) errors.push("City is required");
        if (!shippingInfo.state.trim()) errors.push("State is required");
        if (!shippingInfo.pincode.trim()) errors.push("Pincode is required");

        return errors;
    };

    const validatePayment = () => {
        if (paymentMethod === "upi" && !upiId.trim()) {
            return ["UPI ID is required"];
        }
        return [];
    };

    const handleContinue = () => {
        if (step === 1) {
            const errors = validateShippingInfo();
            if (errors.length > 0) {
                errors.forEach(error => toast.error(error));
                return;
            }
            setStep(2);
        } else if (step === 2) {
            const errors = validatePayment();
            if (errors.length > 0) {
                errors.forEach(error => toast.error(error));
                return;
            }
            setStep(3);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handlePlaceOrder = async () => {
        setIsLoading(true);

        try {
            const orderData = {
                username,
                items: checkoutItems,
                shippingInfo,
                paymentMethod,
                upiId: paymentMethod === "upi" ? upiId : null,
                totalAmount: calculateTotal(),
                orderDate: new Date().toISOString()
            };

            const response = await axios.post("http://localhost:8080/orders/place", orderData);

            // Clear checkout items
            sessionStorage.removeItem("checkoutItems");

            // Show success and navigate to order confirmation
            toast.success("Order placed successfully!");
            navigate(`/order-confirmation/${response.data.orderId}`);

        } catch (error) {
            toast.error("Failed to place order. Please try again.");
            console.error("Order placement error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>

            <div className="checkout-progress">
                <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                    <div className="step-number">1</div>
                    <div className="step-title">Shipping</div>
                </div>
                <div className="progress-line"></div>
                <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                    <div className="step-number">2</div>
                    <div className="step-title">Payment</div>
                </div>
                <div className="progress-line"></div>
                <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                    <div className="step-number">3</div>
                    <div className="step-title">Review</div>
                </div>
            </div>

            <div className="checkout-content">
                {step === 1 && (
                    <div className="checkout-section shipping-section">
                        <h2>Shipping Information</h2>
                        <form className="shipping-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="fullName">Full Name*</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={shippingInfo.fullName}
                                        onChange={handleShippingInfoChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address*</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={shippingInfo.email}
                                        onChange={handleShippingInfoChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number*</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={shippingInfo.phone}
                                    onChange={handleShippingInfoChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Address*</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={shippingInfo.address}
                                    onChange={handleShippingInfoChange}
                                    required
                                ></textarea>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">City*</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={shippingInfo.city}
                                        onChange={handleShippingInfoChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="state">State*</label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={shippingInfo.state}
                                        onChange={handleShippingInfoChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="pincode">Pincode*</label>
                                    <input
                                        type="text"
                                        id="pincode"
                                        name="pincode"
                                        value={shippingInfo.pincode}
                                        onChange={handleShippingInfoChange}
                                        required
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {step === 2 && (
                    <div className="checkout-section payment-section">
                        <h2>Payment Method</h2>

                        <div className="payment-options">
                            <div
                                className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                                onClick={() => setPaymentMethod('cod')}
                            >
                                <div className="payment-radio">
                                    <input
                                        type="radio"
                                        name="payment"
                                        id="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                    />
                                    <label htmlFor="cod"></label>
                                </div>
                                <div className="payment-logo">💰</div>
                                <div className="payment-details">
                                    <h3>Cash on Delivery</h3>
                                    <p>Pay when you receive your order</p>
                                </div>
                            </div>

                            <div
                                className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}
                                onClick={() => setPaymentMethod('upi')}
                            >
                                <div className="payment-radio">
                                    <input
                                        type="radio"
                                        name="payment"
                                        id="upi"
                                        checked={paymentMethod === 'upi'}
                                        onChange={() => setPaymentMethod('upi')}
                                    />
                                    <label htmlFor="upi"></label>
                                </div>
                                <div className="payment-logo">📱</div>
                                <div className="payment-details">
                                    <h3>UPI Payment</h3>
                                    <p>Pay using any UPI app</p>
                                </div>
                            </div>
                        </div>

                        {paymentMethod === 'upi' && (
                            <div className="upi-details">
                                <label htmlFor="upiId">Enter UPI ID*</label>
                                <input
                                    type="text"
                                    id="upiId"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    placeholder="yourname@upi"
                                    required
                                />
                            </div>
                        )}
                    </div>
                )}

                {step === 3 && (
                    <div className="checkout-section review-section">
                        <h2>Review Your Order</h2>

                        <div className="order-details">
                            <div className="order-section">
                                <h3>Shipping Address</h3>
                                <div className="info-box">
                                    <p><strong>{shippingInfo.fullName}</strong></p>
                                    <p>{shippingInfo.address}</p>
                                    <p>{shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}</p>
                                    <p>Phone: {shippingInfo.phone}</p>
                                    <p>Email: {shippingInfo.email}</p>
                                </div>
                            </div>

                            <div className="order-section">
                                <h3>Payment Method</h3>
                                <div className="info-box">
                                    {paymentMethod === 'cod' ? (
                                        <p>Cash on Delivery</p>
                                    ) : (
                                        <p>UPI Payment - {upiId}</p>
                                    )}
                                </div>
                            </div>

                            <div className="order-summary">
                                <h3>Order Summary</h3>
                                <div className="order-items">
                                    {checkoutItems.map((item) => (
                                        <div className="order-item" key={item.id}>
                                            <div className="item-image">
                                                <img src={item.productImage} alt={item.productName} />
                                            </div>
                                            <div className="item-details">
                                                <h4>{item.productName}</h4>
                                                <p className="item-price">₹{item.productPrice.toLocaleString()} × {item.quantity}</p>
                                            </div>
                                            <div className="item-total">
                                                ₹{(item.productPrice * item.quantity).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="summary-totals">
                                    <div className="summary-row">
                                        <span>Subtotal</span>
                                        <span>₹{calculateTotal().toLocaleString()}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Shipping</span>
                                        <span>FREE</span>
                                    </div>
                                    <div className="summary-row total">
                                        <span>Total</span>
                                        <span>₹{calculateTotal().toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="checkout-actions">
                    {step > 1 && (
                        <button
                            className="btn-secondary"
                            onClick={handleBack}
                            disabled={isLoading}
                        >
                            Back
                        </button>
                    )}

                    {step < 3 ? (
                        <button
                            className="btn-primary"
                            onClick={handleContinue}
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            className="btn-primary"
                            onClick={handlePlaceOrder}
                            disabled={isLoading}
                        >
                            {isLoading ? "Processing..." : "Place Order"}
                        </button>
                    )}
                </div>
            </div>

            <div className="order-sidebar">
                <h3>Order Summary</h3>
                <div className="sidebar-items">
                    {checkoutItems.map((item) => (
                        <div className="sidebar-item" key={item.id}>
                            <span className="item-name">{item.productName} × {item.quantity}</span>
                            <span className="item-price">₹{(item.productPrice * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                </div>

                <div className="sidebar-totals">
                    <div className="total-row">
                        <span>Subtotal</span>
                        <span>₹{calculateTotal().toLocaleString()}</span>
                    </div>
                    <div className="total-row">
                        <span>Shipping</span>
                        <span>FREE</span>
                    </div>
                    <div className="total-row final">
                        <span>Total</span>
                        <span>₹{calculateTotal().toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;