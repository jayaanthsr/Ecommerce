
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import '../../styles/ProductCard.css';

const ProductCard = ({ product, addToCart }) => {
  const { id, name, price, image, category, description, rating, onSale, salePercentage } = product;

  const truncateDescription = (text, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);

    // Add a small animation to the button when clicked
    const button = e.currentTarget;
    button.classList.add('animate-pulse-gentle');
    setTimeout(() => {
      button.classList.remove('animate-pulse-gentle');
    }, 500);
  };

  // Calculate the staggered animation delay for a nice cascade effect
  const animationDelay = (id % 10) * 0.1;

  return (
      <div
          className="product-card"
          style={{ animationDelay: `${animationDelay}s` }}
      >
        {onSale && (
            <div className="product-sale-badge">
              {salePercentage}% OFF
            </div>
        )}

        <div className="product-image-container">
          <Link to={`/product/${id}`}>
            <img src={image} alt={name} className="product-image" />
          </Link>
        </div>

        <div className="product-content">
          <div className="product-category">{category}</div>
          <Link to={`/product/${id}`} className="product-name">{name}</Link>
          <div className="product-description">{truncateDescription(description)}</div>
          <div className="product-price">
            ₹{price.toFixed(2)}
            {onSale && (
                <span className="original-price">₹{(price * (100 + salePercentage) / 100).toFixed(2)}</span>
            )}
          </div>

          <div className="product-actions">
            <div className="product-rating">
              <Star size={16} fill="#ffa000" stroke="#ffa000" />
              <span>{rating}</span>
            </div>

            <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
            >
              <ShoppingCart size={16} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
  );
};

export default ProductCard;
