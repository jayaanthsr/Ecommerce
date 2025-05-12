
import React, { useState, useEffect, useRef } from 'react';
import ProductCard from '../common/ProductCard';
import CategoryList from '../common/CategoryList';
import { Search, ShoppingBag, Truck, RotateCcw, ShieldCheck, HeadphonesIcon, Tv,  Percent } from 'lucide-react';
import '../../styles/Home.css';
import { toast } from "sonner";
import { productApi } from "../../api/api.js";

const Home = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const searchInputRef = useRef(null);

  const sliderData = [
    {
      title: "SUMMER ELECTRONICS SALE",
      subtitle: "Up to 50% Off on Premium Products",
      description: "Upgrade your home with the latest TVs, Remotes, and DTH packages",
      btnText: "Shop Now",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200",
      color: "linear-gradient(90deg, hsla(221, 45%, 73%, 1) 0%, hsla(220, 78%, 29%, 1) 100%)"
    },
    {
      title: "NEW DTH PACKAGES",
      subtitle: "Best Entertainment Experience",
      description: "Discover hundreds of channels with crystal clear picture quality",
      btnText: "Explore Plans",
      image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1200",
      color: "linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)"
    },
    {
      title: "PREMIUM TV COLLECTION",
      subtitle: "Smart. Elegant. Powerful.",
      description: "Experience cinema-like quality in the comfort of your home",
      btnText: "View Collection",
      image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1200",
      color: "linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)"
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getAllProducts();
        setProducts(response.data);
        setFilteredProducts(response.data);
        toast.success("Products loaded successfully!");
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error("Failed to load products. Please try again.");
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Focus back to top when category changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCartWithNotification = (product) => {
    addToCart(product);
  };

  const handleShopNow = () => {
    searchInputRef.current?.focus();
    window.scrollTo({
      top: searchInputRef.current?.getBoundingClientRect().top + window.scrollY - 100,
      behavior: 'smooth'
    });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
        <div className="loading-container">
          <div className="loader">
            <div className="spinner"></div>
          </div>
          <p className="loading-text">Loading amazing products for you...</p>
        </div>
    );
  }

  return (
      <div className="home-container">
        {/* Main Hero Slider */}
        <div className="hero-slider">
          <div
              className="slider-wrapper"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {sliderData.map((slide, index) => (
                <div
                    key={index}
                    className="slide"
                    style={{
                      background: slide.color
                    }}
                >
                  <div className="slide-content">
                    <h1 className="slide-title">{slide.title}</h1>
                    <h2 className="slide-subtitle">{slide.subtitle}</h2>
                    <p className="slide-description">{slide.description}</p>
                    <button className="slide-button" onClick={handleShopNow}>
                      {slide.btnText}
                    </button>
                  </div>
                  <div
                      className="slide-image"
                      style={{ backgroundImage: `url(${slide.image})` }}
                  >
                    <div className="slide-overlay"></div>
                  </div>
                </div>
            ))}
          </div>

          <button className="slider-nav prev" onClick={prevSlide}>❮</button>
          <button className="slider-nav next" onClick={nextSlide}>❯</button>

          <div className="slider-indicators">
            {sliderData.map((_, index) => (
                <button
                    key={index}
                    className={`slider-indicator ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                ></button>
            ))}
          </div>
        </div>

        {/* Offer Highlights Section */}
        <div className="offer-highlights">
          <div className="offer-card">
            <div className="offer-icon">
              <Tv size={32} />
            </div>
            <div className="offer-content">
              <h3>Premium TVs</h3>
              <p>Starting at ₹19,999</p>
            </div>
          </div>

          <div className="offer-card">
            <div className="offer-icon">
              <Tv size={32} />
            </div>
            <div className="offer-content">
              <h3>Smart Remotes</h3>
              <p>Voice-controlled devices</p>
            </div>
          </div>

          <div className="offer-card">
            <div className="offer-icon">
              <Percent size={32} />
            </div>
            <div className="offer-content">
              <h3>Summer Sale</h3>
              <p>Up to 50% off</p>
            </div>
          </div>
        </div>

        <div className="search-section">
          <div className="search-container">
            <h2 className="search-title">Find Your Perfect Electronics</h2>
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  style={{color:'black'}}
                  onChange={handleSearchChange}
                  className="search-input"
                  ref={searchInputRef}

              />
            </div>
          </div>
        </div>

        <CategoryList
            onSelectCategory={handleCategorySelect}
            selectedCategory={selectedCategory}
        />

        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              {selectedCategory === 'all'
                  ? 'Featured Products'
                  : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
            </h2>
            <div id="section-subtitle" className="section-subtitle">
              Discover our handpicked selection of premium electronics
            </div>
          </div>

          {filteredProducts.length === 0 ? (
              <div className="no-products">
                <ShoppingBag size={48} className="no-products-icon" />
                <p>No products found. Try a different search or category.</p>
                <button
                    className="return-all-btn"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                >
                  View All Products
                </button>
              </div>
          ) : (
              <div className="product-grid">
                {filteredProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        addToCart={() => handleAddToCartWithNotification(product)}
                    />
                ))}
              </div>
          )}
        </div>

        <div className="promo-banner">
          <div className="promo-content">
            <h2>Summer Entertainment Package</h2>
            <p>Get a FREE DTH connection with any TV purchase above ₹30,000</p>
            <button className="promo-button" onClick={handleShopNow}>Shop TVs Now</button>
          </div>
        </div>

        <div className="features-section">
          <div className="section-header">
            <h2 className="section-title">Why Shop With Us</h2>
            <div className="section-subtitle">We offer the best shopping experience</div>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-container">
                <Truck size={36} className="feature-icon" />
              </div>
              <h3 className="feature-title">Free Shipping</h3>
              <p className="feature-description">On orders over ₹999</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-container">
                <RotateCcw size={36} className="feature-icon" />
              </div>
              <h3 className="feature-title">Easy Returns</h3>
              <p className="feature-description">30 day return policy</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-container">
                <ShieldCheck size={36} className="feature-icon" />
              </div>
              <h3 className="feature-title">Secure Payment</h3>
              <p className="feature-description">Safe & encrypted</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-container">
                <HeadphonesIcon size={36} className="feature-icon" />
              </div>
              <h3 className="feature-title">24/7 Support</h3>
              <p className="feature-description">Dedicated support</p>
            </div>
          </div>
        </div>

        <div className="newsletter-section">
          <div className="newsletter-content">
            <h2>Join Our Newsletter</h2>
            <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Home;
