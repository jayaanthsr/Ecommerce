import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './styles/App.css';

// User components
import Home from './components/user/Home';
import ProductDetails from './components/user/ProductDetails';
import Cart from './components/user/Cart';
import Checkout from './components/user/Checkout';
import OrderConfirmation from './components/user/OrderConfirmation';
import UserOrders from './components/user/UserOrders';

// Admin components
import AdminDashboard from './components/admin/AdminDashboard';
import ProductManagement from './components/admin/ProductManagement';
import OrderManagement from './components/admin/OrderManagement';

// Common components
import Header from './components/common/AdminHeader';
import Footer from './components/common/Footer';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(
        cartItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(
      cartItems.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleAdmin = () => {
    setIsAdmin(!isAdmin);
  };

  return (
    <Router>
      <div className="app">
        <Header 
          cartItems={cartItems} 
          isAdmin={isAdmin} 
          toggleAdmin={toggleAdmin} 
        />
        
        <main className="main-content">
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route 
              path="/product/:id" 
              element={<ProductDetails addToCart={addToCart} />} 
            />
            <Route 
              path="/cart" 
              element={
                <Cart 
                  cartItems={cartItems} 
                  removeFromCart={removeFromCart} 
                  updateQuantity={updateQuantity} 
                />
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <Checkout 
                  cartItems={cartItems} 
                  clearCart={clearCart} 
                />
              } 
            />
            <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
            <Route path="/orders" element={<UserOrders />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/orders" element={<OrderManagement />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;