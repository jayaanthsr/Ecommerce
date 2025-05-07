import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import '../../styles/ProductCard.css';

const ProductCard = ({ product, addToCart }) => {
  const { id, name, price, image, category, description, rating, onSale, salePercentage } = product;
  
  const truncateDescription = (text, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  return (
    <div className="product-card">
      {onSale && (
        <div className="product-sale-badge">
          {salePercentage}% OFF
        </div>
      )}
      
      <div className="product-image-container">
        <Link to={`/product/₹{id}`}>
          <img src={image} alt={name} className="product-image" />
        </Link>
      </div>
      
      <div className="product-content">
        <div className="product-category">{category}</div>
        <Link to={`/product/₹{id}`} className="product-name">{name}</Link>
        <div className="product-description">{truncateDescription(description)}</div>
        <div className="product-price">₹{price.toFixed(2)}</div>
        
        <div className="product-actions">
          <div className="product-rating">
            <Star size={16} fill="#ffa000" stroke="#ffa000" />
            <span>{rating}</span>
          </div>
          
          <button className="btn btn-primary btn-sm" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;