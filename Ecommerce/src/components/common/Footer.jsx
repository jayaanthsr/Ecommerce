import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">ShopEasy</h3>
          <p>Your one-stop shop for all your needs. Quality products, great prices, and excellent customer service.</p>
          <div className="social-links">
            <a href="#" className="social-link">
              <Facebook size={18} />
            </a>
            <a href="#" className="social-link">
              <Instagram size={18} />
            </a>
            <a href="#" className="social-link">
              <Twitter size={18} />
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Shop</h3>
          <Link to="/" className="footer-link">All Products</Link>
          <Link to="/" className="footer-link">Featured</Link>
          <Link to="/" className="footer-link">Discounts</Link>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Customer Service</h3>
          <Link to="/" className="footer-link">Contact Us</Link>
          <Link to="/" className="footer-link">FAQ</Link>
          <Link to="/" className="footer-link">Shipping & Returns</Link>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Contact</h3>
          <div className="flex gap-2 items-center">
            <MapPin size={16} />
            <span>Sri Shakthi Cinemas Opp., Erode - 638002</span>
          </div>
          <div className="flex gap-2 items-center">
            <Phone size={16} />
            <span>+91 85082 86070</span>
          </div>
          <div className="flex gap-2 items-center">
            <Mail size={16} />
            <span>bharath023@gmail.com</span>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Bharath Electronics. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;