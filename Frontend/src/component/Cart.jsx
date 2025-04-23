import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./styles/Cart.css";

function Cart() {
    const username = sessionStorage.getItem("userName");
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [quantities, setQuantities] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        if (!username) {
            toast.error("Please login to view your cart");
            navigate("/login");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`http://localhost:8080/cart/${username}`);
            setCartItems(response.data);

            // Initialize quantities
            const initialQuantities = {};
            response.data.forEach(item => {
                initialQuantities[item.id] = item.quantity || 1;
            });
            setQuantities(initialQuantities);
        } catch (error) {
            toast.error("Failed to fetch cart items");
            console.error("Error fetching cart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity < 1) return;

        setQuantities({
            ...quantities,
            [id]: newQuantity
        });

        // Update quantity in backend (you can implement this later)
        updateCartItemQuantity(id, newQuantity);
    };

    const updateCartItemQuantity = async (id, quantity) => {
        try {
            await axios.put(`http://localhost:8080/cart/update/${username}/${id}`, { quantity });
        } catch (error) {
            console.error("Error updating quantity:", error);
            // We don't show an error toast here as it might be annoying with frequent updates
        }
    };

    const removeFromCart = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/cart/remove/${username}/${id}`);
            toast.success("Item removed from cart");
            fetchCartItems();
        } catch (error) {
            toast.error("Failed to remove item");
            console.error("Error removing item:", error);
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.productPrice * (quantities[item.id] || 1));
        }, 0);
    };

    const handleCheckout = () => {
        const checkoutItems = cartItems.map(item => ({
            ...item,
            quantity: quantities[item.id] || 1
        }));

        sessionStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));
        navigate("/checkout");
    };

    if (isLoading) {
        return (
            <div className="cart-container loading">
                <div className="loader"></div>
                <p>Loading your cart...</p>
            </div>
        );
    }

    if (!cartItems.length) {
        return (
            <div className="cart-container empty">
                <div className="empty-cart">
                    <i className="cart-icon">🛒</i>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any products to your cart yet.</p>
                    <button className="continue-shopping" onClick={() => navigate("/")}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1>Your Shopping Cart</h1>

            <div className="cart-content">
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div className="cart-item" key={item.id}>
                            <div className="item-image">
                                <img src={item.productImage} alt={item.productName} />
                            </div>

                            <div className="item-details">
                                <h3>{item.productName}</h3>
                                <p className="item-price">₹{item.productPrice.toLocaleString()}</p>
                                <p className="item-category">{item.productCategory}</p>
                                <div className="item-description">{item.productDescription}</div>
                            </div>

                            <div className="item-actions">
                                <div className="quantity-controls">
                                    <button
                                        onClick={() => handleQuantityChange(item.id, quantities[item.id] - 1)}
                                        disabled={quantities[item.id] <= 1}
                                    >
                                        -
                                    </button>
                                    <span>{quantities[item.id] || 1}</span>
                                    <button onClick={() => handleQuantityChange(item.id, quantities[item.id] + 1)}>
                                        +
                                    </button>
                                </div>

                                <div className="item-total">
                                    ₹{(item.productPrice * (quantities[item.id] || 1)).toLocaleString()}
                                </div>

                                <button
                                    className="remove-btn"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h2>Order Summary</h2>

                    <div className="summary-row">
                        <span>Subtotal ({cartItems.length} items)</span>
                        <span>₹{calculateSubtotal().toLocaleString()}</span>
                    </div>

                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>FREE</span>
                    </div>

                    <div className="summary-row total">
                        <span>Total</span>
                        <span>₹{calculateSubtotal().toLocaleString()}</span>
                    </div>

                    <button className="checkout-btn" onClick={handleCheckout}>
                        Proceed to Checkout
                    </button>

                    <button className="continue-shopping" onClick={() => navigate("/")}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Cart;