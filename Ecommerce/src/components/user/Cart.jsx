import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import '../../styles/Cart.css';

const Cart = ({ cartItems, removeFromCart, updateQuantity }) => {
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const subtotal = calculateSubtotal();
  const shippingCost = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.07;
  const total = subtotal + shippingCost + tax;
  
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">
          <ShoppingBag size={64} />
        </div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any products to your cart yet.</p>
        <Link to="/" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }
  
  return (
    <div className="cart-container">
      <h1 className="page-title">Your Shopping Cart</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          <div className="cart-header">
            <div className="cart-header-product">Product</div>
            <div className="cart-header-price">Price</div>
            <div className="cart-header-quantity">Quantity</div>
            <div className="cart-header-total">Total</div>
            <div className="cart-header-actions"></div>
          </div>
          
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-product">
                <img 
                  src={item.image || item.images?.[0]} 
                  alt={item.name} 
                  className="cart-item-image" 
                />
                <div className="cart-item-details">
                  <Link to={`/product/${item.id}`} className="cart-item-name">
                    {item.name}
                  </Link>
                  <div className="cart-item-category">{item.category}</div>
                </div>
              </div>
              
              <div className="cart-item-price">${item.price.toFixed(2)}</div>
              
              <div className="cart-item-quantity">
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <div className="cart-item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              
              <div className="cart-item-actions">
                <button 
                  className="btn-remove"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span>
              {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
            </span>
          </div>
          
          <div className="summary-row">
            <span>Tax (7%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          
          <div className="summary-divider"></div>
          
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <div className="summary-actions">
            <Link to="/checkout" className="btn btn-primary btn-lg btn-block">
              Proceed to Checkout
            </Link>
            
            <Link to="/" className="btn btn-secondary btn-block">
              Continue Shopping
            </Link>
          </div>
          
          <div className="cart-notes">
            <p>Free shipping on orders over $50</p>
            <p>Easy 30-day returns</p>
            <p>Secure checkout process</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;