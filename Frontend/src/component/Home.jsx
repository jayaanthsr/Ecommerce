import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Home.css";
import Navbar from "./Navbar.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSearch, FaStar, FaStarHalfAlt } from "react-icons/fa";

function Home() {
    const [productData, setProductData] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const userName = sessionStorage.getItem("userName");

    // Extract search query from URL if present
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get("query");
        if (query) {
            setSearchTerm(query);
        }
    }, [location]);

    // Fetch products
    useEffect(() => {
        setIsLoading(true);
        axios.get("http://localhost:8080/admin/display")
            .then((res) => {
                setProductData(res.data);
                setFilteredProducts(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log("Error fetching products:", err);
                setIsLoading(false);
            });
    }, []);

    // Filter products when search term or category changes
    useEffect(() => {
        if (productData.length > 0) {
            let results = productData;

            // Filter by search term
            if (searchTerm) {
                results = results.filter(product =>
                    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (product.productDescription && product.productDescription.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }

            // Filter by category
            if (selectedCategory !== "All") {
                results = results.filter(product =>
                    product.productCategory === selectedCategory
                );
            }

            setFilteredProducts(results);
        }
    }, [searchTerm, selectedCategory, productData]);

    // Get unique categories from products
    const categories = ["All", ...new Set(productData.map(product => product.productCategory || "Uncategorized"))];

    const addToCart = (id, event) => {
        // Stop propagation to prevent modal opening
        event && event.stopPropagation();

        if (sessionStorage.getItem("isLogged") === "user") {
            axios.post("http://localhost:8080/user/addToCart", { username: userName, productId: id })
                .then(() => {
                    toast.success("The product was added to the cart", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                })
                .catch((err) => {
                    toast.error("Failed to add the product to the cart", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                });
        } else {
            toast.error("Login to Buy or Add product", { autoClose: 3000 });
        }
    };

    const handleBuyNow = (id, event) => {
        // Stop propagation to prevent modal opening
        event && event.stopPropagation();

        if (sessionStorage.getItem("isLogged") === "user") {
            navigate(`/checkout/${id}`);
        } else {
            toast.error("Login to Buy or Add product", { autoClose: 3000 });
        }
    };

    // Generate random ratings for demo purposes
    const generateRating = () => {
        return (Math.random() * 2 + 3).toFixed(1); // Generates a rating between 3.0 and 5.0
    };

    // Render star ratings
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`star-${i}`} className="star-icon filled" />);
        }

        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half-star" className="star-icon filled" />);
        }

        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaStar key={`empty-star-${i}`} className="star-icon empty" />);
        }

        return stars;
    };

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/?query=${encodeURIComponent(searchTerm)}`);
    };

    return (
        <>
            <Navbar />
            <div className="main-container">
                {/* Hero Banner */}
                <div className="hero-banner">
                    <div className="hero-content">
                        <h1>Welcome to MyStore</h1>
                        <p>Discover amazing products at unbeatable prices</p>
                    </div>
                </div>

                {/* Search & Filter Section */}
                <div className="search-filter-container">
                    <form onSubmit={handleSearch} className="search-bar">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit"><FaSearch /></button>
                    </form>

                    <div className="category-filter">
                        <span>Filter by: </span>
                        <div className="category-buttons">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={selectedCategory === category ? 'active' : ''}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="home-container">
                    <h2>{searchTerm ? `Search Results for "${searchTerm}"` : selectedCategory !== "All" ? `${selectedCategory} Products` : "Our Products"}</h2>

                    {isLoading ? (
                        <div className="loading-spinner">Loading products...</div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="no-products">
                            <h3>No products found</h3>
                            <p>Try a different search term or category</p>
                        </div>
                    ) : (
                        <div className="card-grid">
                            {filteredProducts.map((product) => {
                                const rating = generateRating();
                                return (
                                    <div className="product-card" key={product.id} onClick={() => setSelectedProduct(product)}>
                                        <div className="card-image-container">
                                            <img src={product.productImage} alt={product.productName} className="product-image" />
                                        </div>
                                        <div className="card-content">
                                            <h3>{product.productName}</h3>
                                            <div className="product-rating">
                                                <div className="stars">{renderStars(rating)}</div>
                                                <span className="rating-count">{Math.floor(Math.random() * 1000) + 10}</span>
                                            </div>
                                            <p className="product-price">₹{product.productPrice}</p>
                                            <div className="card-buttons">
                                                <button
                                                    className="buy-now-btn"
                                                    onClick={(e) => handleBuyNow(product.id, e)}
                                                >
                                                    Buy Now
                                                </button>
                                                <button
                                                    className="add-cart-btn"
                                                    onClick={(e) => addToCart(product.id, e)}
                                                >
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {selectedProduct && (
                <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={() => setSelectedProduct(null)}>×</button>
                        <div className="modal-content">
                            <div className="modal-left">
                                <img src={selectedProduct.productImage} alt={selectedProduct.productName} className="modal-image" />
                                <div className="additional-images">
                                    <img src={selectedProduct.productImage} alt="Additional view" />
                                    <img src={selectedProduct.productImage} alt="Additional view" />
                                    <img src={selectedProduct.productImage} alt="Additional view" />
                                </div>
                            </div>
                            <div className="modal-right">
                                <h2>{selectedProduct.productName}</h2>
                                <div className="product-rating">
                                    <div className="stars">{renderStars(generateRating())}</div>
                                    <span className="rating-count">{Math.floor(Math.random() * 1000) + 10} ratings</span>
                                </div>
                                <div className="modal-price">
                                    <p className="price-label">Price:</p>
                                    <p className="price-value">₹{selectedProduct.productPrice}</p>
                                </div>
                                <div className="product-availability">In Stock</div>
                                <div className="product-description">
                                    <h3>About this item</h3>
                                    <p>{selectedProduct.productDescription || "No description available for this product."}</p>
                                </div>
                                <div className="modal-buttons">
                                    <button onClick={() => handleBuyNow(selectedProduct.id)}>Buy Now</button>
                                    <button onClick={() => addToCart(selectedProduct.id)}>Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Home;