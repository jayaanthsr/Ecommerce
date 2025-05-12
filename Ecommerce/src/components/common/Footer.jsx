
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';
import '../../styles/Footer.css';

const Footer = () => {
  return (
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag size={24} className="text-shop-primary" />
              <h3 className="footer-title">Bharath Electronics</h3>
            </div>
            <p>Your one-stop shop for all your needs. Quality products, great prices, and excellent customer service.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook" className="social-link">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="social-link">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="social-link">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Shop</h3>
            <Link to="/" className="footer-link">All Products</Link>
            <Link to="/" className="footer-link">Featured</Link>
            <Link to="/" className="footer-link">On Sale</Link>
            <Link to="/" className="footer-link">New Arrivals</Link>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Customer Service</h3>
            <Link to="/" className="footer-link">Contact Us</Link>
            <Link to="/" className="footer-link">FAQ</Link>
            <Link to="/" className="footer-link">Shipping & Returns</Link>
            <Link to="/" className="footer-link">Privacy Policy</Link>
            <Link to="/" className="footer-link">Terms & Conditions</Link>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Contact</h3>
            <div className="flex gap-2 items-center text-gray-400 text-sm py-1">
              <MapPin size={16} className="text-shop-primary" />
              <span>Sri Shakthi Cinemas Opp., Erode - 638002</span>
            </div>
            <div className="flex gap-2 items-center text-gray-400 text-sm py-1">
              <Phone size={16} className="text-shop-primary" />
              <span>+91 85082 86070</span>
            </div>
            <div className="flex gap-2 items-center text-gray-400 text-sm py-1">
              <Mail size={16} className="text-shop-primary" />
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
