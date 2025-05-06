import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
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

// Auth components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Common components
import UserHeader from './components/common/UserHeader';
import AdminHeader from './components/common/AdminHeader';
import Footer from './components/common/Footer';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  // var navigate = useNavigate();
  useEffect(() => {
    localStorage.setItem('userRole', 'logout');
  }, []);
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');
    if (role && username) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const addToCart = (product) => {
    if (!isAuthenticated) {
      return false;
    }

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
    return true;
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

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.setItem('userRole', 'logout');
    localStorage.removeItem('username');
  };

  const PrivateRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/" />;
    }

    return children;
  };

  return (
    <Router>
      <div className="app">
        {isAuthenticated && userRole === 'user' || userRole === 'logout' && (
            <UserHeader
                cartItems={cartItems}
                onLogout={handleLogout}
            />
        )}
        {isAuthenticated && userRole === 'admin' && (
            <AdminHeader
                onLogout={handleLogout}
            />
        )}


        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              <Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />
            } />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />

            {/* User Routes */}
            <Route path="/cart" element={
              <PrivateRoute allowedRoles={['user']}>
                <Cart 
                  cartItems={cartItems} 
                  removeFromCart={removeFromCart} 
                  updateQuantity={updateQuantity} 
                />
              </PrivateRoute>
            } />
            <Route path="/checkout" element={
              <PrivateRoute allowedRoles={['user']}>
                <Checkout 
                  cartItems={cartItems} 
                  clearCart={clearCart} 
                />
              </PrivateRoute>
            } />
            <Route path="/order-confirmation/:id" element={
              <PrivateRoute allowedRoles={['user']}>
                <OrderConfirmation />
              </PrivateRoute>
            } />
            <Route path="/orders" element={
              <PrivateRoute allowedRoles={['user']}>
                <UserOrders />
              </PrivateRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            } />
            <Route path="/admin/products" element={
              <PrivateRoute allowedRoles={['admin']}>
                <ProductManagement />
              </PrivateRoute>
            } />
            <Route path="/admin/orders" element={
              <PrivateRoute allowedRoles={['admin']}>
                <OrderManagement />
              </PrivateRoute>
            } />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;