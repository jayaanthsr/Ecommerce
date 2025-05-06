import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ChevronLeft, ChevronRight, Star, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { productApi } from '../../api/api';
import '../../styles/ProductDetails.css';

const ProductDetails = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Using mock data until backend is ready

        const response = await productApi.getProductById(id);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);
  
  const handleAddToCart = () => {
    if (product) {
      const productToAdd = {
        ...product,
        image: product.images ? product.images[0] : product.image
      };
      
      for (let i = 0; i < quantity; i++) {
        addToCart(productToAdd);
      }
    }
  };
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 10)) {
      setQuantity(value);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < (product?.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const nextImage = () => {
    if (product?.images) {
      setActiveImage((activeImage + 1) % product.images.length);
    }
  };
  
  const prevImage = () => {
    if (product?.images) {
      setActiveImage((activeImage - 1 + product.images.length) % product.images.length);
    }
  };
  
  const selectImage = (index) => {
    setActiveImage(index);
  };
  
  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }
  
  if (!product) {
    return (
      <div className="not-found">
        <h2>Product not found</h2>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }
  
  const discountedPrice = product.onSale 
    ? product.price 
    : product.price;
  
  const originalPrice = product.onSale 
    ? product.originalPrice 
    : null;
  
  return (
    <div className="product-details-container">
      <div className="product-breadcrumb">
        <Link to="/">Home</Link> / <Link to="/">Products</Link> / {product.name}
      </div>
      
      <div className="product-details">
        <div className="product-gallery">
          <div className="product-main-image">
            {product.onSale && (
              <div className="product-sale-badge">
                {product.salePercentage}% OFF
              </div>
            )}
            
            <img 
              src={product.images ? product.images[activeImage] : product.image} 
              alt={product.name} 
              className="main-image" 
            />
            
            {product.images && product.images.length > 1 && (
              <>
                <button className="gallery-nav prev" onClick={prevImage}>
                  <ChevronLeft size={24} />
                </button>
                
                <button className="gallery-nav next" onClick={nextImage}>
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="product-thumbnails">
              {product.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                  onClick={() => selectImage(index)}
                >
                  <img src={image} alt={`${product.name} - Image ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          
          <div className="product-meta">
            <div className="product-rating">
              <Star size={16} fill="#ffa000" stroke="#ffa000" />
              <span>{product.rating}</span>
              <span className="review-count">({product.reviews} reviews)</span>
            </div>
            
            <div className="product-category">Category: {product.category}</div>
          </div>
          
          <div className="product-price-container">
            <div className="product-price">${discountedPrice.toFixed(2)}</div>
            
            {originalPrice && (
              <div className="product-original-price">${originalPrice.toFixed(2)}</div>
            )}
          </div>
          
          <div className="product-description">
            {product.description}
          </div>
          
          {product.specifications && (
            <div className="product-specifications">
              <h3>Specifications</h3>
              <ul>
                {product.specifications.map((spec, index) => (
                  <li key={index}>
                    <span className="spec-name">{spec.name}:</span> {spec.value}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="product-stock">
            <span className={`stock-indicator ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
            
            {product.stock > 0 && product.stock < 5 && (
              <span className="low-stock">Only {product.stock} left!</span>
            )}
          </div>
          
          <div className="quantity-selector">
            <span className="quantity-label">Quantity:</span>
            <div className="quantity-controls">
              <button className="quantity-btn" onClick={decreaseQuantity}>-</button>
              <input 
                type="number" 
                min="1" 
                max={product.stock || 10} 
                value={quantity} 
                onChange={handleQuantityChange} 
                className="quantity-input" 
              />
              <button className="quantity-btn" onClick={increaseQuantity}>+</button>
            </div>
          </div>
          
          <div className="product-actions">
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          </div>
          
          <div className="product-perks">
            <div className="perk">
              <Truck size={20} />
              <div className="perk-text">
                <strong>Free Shipping</strong>
                <span>On orders over $50</span>
              </div>
            </div>
            
            <div className="perk">
              <RotateCcw size={20} />
              <div className="perk-text">
                <strong>Easy Returns</strong>
                <span>30 day return policy</span>
              </div>
            </div>
            
            <div className="perk">
              <ShieldCheck size={20} />
              <div className="perk-text">
                <strong>Secure Checkout</strong>
                <span>Safe & encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;