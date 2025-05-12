import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, AlertCircle, ShoppingBag } from 'lucide-react';
import { orderApi } from '../../api/api';
import '../../styles/Checkout.css';

const Checkout = ({ cartItems, clearCart }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const shippingCost = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.07;
  const total = subtotal + shippingCost + tax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!formData.country) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country
        },
        subtotal,
        shipping: shippingCost,
        tax,
        total
      };

      const response = await orderApi.placeOrder(orderData);
      const orderId = response.data.id;

      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error('Error placing order:', error);
      setErrors({
        submit: 'There was an error processing your order. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
        <div className="empty-checkout">
          <div className="empty-checkout-icon">
            <ShoppingBag size={64} />
          </div>
          <h2>Your cart is empty</h2>
          <p>You need to add some items to your cart before checking out.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Browse Products
          </button>
        </div>
    );
  }

  return (
      <div className="checkout-container">
        <h1 className="page-title">Checkout</h1>

        {errors.submit && (
            <div className="error-alert">
              <AlertCircle size={20} />
              <span>{errors.submit}</span>
            </div>
        )}

        <div className="checkout-content">
          <div className="checkout-form-container">
            <form className="checkout-form" onSubmit={handleSubmit}>
              <section className="form-section">
                <h2 className="section-title">Personal Information</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`form-input ${errors.firstName ? 'error' : ''}`}
                    />
                    {errors.firstName && <div className="form-error">{errors.firstName}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`form-input ${errors.lastName ? 'error' : ''}`}
                    />
                    {errors.lastName && <div className="form-error">{errors.lastName}</div>}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                  />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>
              </section>

              <section className="form-section">
                <h2 className="section-title">Shipping Information</h2>
                <div className="form-group">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`form-input ${errors.address ? 'error' : ''}`}
                  />
                  {errors.address && <div className="form-error">{errors.address}</div>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">Landmark</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`form-input ${errors.city ? 'error' : ''}`}
                    />
                    {errors.city && <div className="form-error">{errors.city}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="zipCode" className="form-label">ZIP Code</label>
                    <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={`form-input ${errors.zipCode ? 'error' : ''}`}
                    />
                    {errors.zipCode && <div className="form-error">{errors.zipCode}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="country" className="form-label">Country</label>
                  <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`form-input ${errors.country ? 'error' : ''}`}
                  >
                    <option value="">Select a District</option>
                    <option value="Erode">Erode</option>
                    <option value="Tirupur">Tirupur</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Namakal">Namakal</option>
                  </select>
                  {errors.country && <div className="form-error">{errors.country}</div>}
                </div>
              </section>

              <div className="form-actions">
                <button
                    type="submit"
                    className="btn btn-primary btn-lg btn-block"
                    disabled={loading}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>

          <div className="checkout-summary">
            <h2 className="summary-title">Order Summary</h2>

            <div className="cart-items-summary">
              {cartItems.map(item => (
                  <div key={item.id} className="summary-item">
                    <div className="summary-item-image">
                      <img src={item.image || item.images?.[0]} alt={item.name} />
                      <span className="summary-item-quantity">{item.quantity}</span>
                    </div>
                    <div className="summary-item-details">
                      <div className="summary-item-name">{item.name}</div>
                      <div className="summary-item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span>
            </div>

            <div className="summary-row">
              <span>Tax (7%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <div className="checkout-badges">
              <div className="checkout-badge">
                <Check size={16} />
                <span>Secure Payment</span>
              </div>
              <div className="checkout-badge">
                <Check size={16} />
                <span>Free Returns</span>
              </div>
              <div className="checkout-badge">
                <Check size={16} />
                <span>Quality Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Checkout;
