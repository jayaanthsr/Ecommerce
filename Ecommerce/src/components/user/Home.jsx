import React, { useState, useEffect } from 'react';
import ProductCard from '../common/ProductCard';
import CategoryList from '../common/CategoryList';
import { Search } from 'lucide-react';
import { productApi } from '../../api/api';
import '../../styles/Home.css';

const Home = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getAllProducts();
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(product =>
        product.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, products]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to ShopEasy</h1>
          <p className="hero-subtitle">Discover amazing products at unbeatable prices</p>
        </div>
      </div>

      <div className="search-bar">
        <div className="search-input-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      <CategoryList
        onSelectCategory={handleCategorySelect}
        selectedCategory={selectedCategory}
      />

      <h2 className="section-title">
        {selectedCategory === 'all' ? 'All Products' : selectedCategory}
      </h2>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found. Try a different search or category.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      )}

      <div className="featured-section">
        <h2 className="section-title">Why Shop With Us</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3 className="feature-title">Free Shipping</h3>
            <p className="feature-description">On orders over ₹50</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3 className="feature-title">Easy Returns</h3>
            <p className="feature-description">30 day return policy</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Secure Payment</h3>
            <p className="feature-description">Safe & encrypted</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3 className="feature-title">24/7 Support</h3>
            <p className="feature-description">Dedicated support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;