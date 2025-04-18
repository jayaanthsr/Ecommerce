import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Home.css";

function Home() {
    const [productData, setProductData] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/admin/display")
            .then((res) => {
                setProductData(res.data);
            })
            .catch((err) => {
                console.log("Error fetching products:", err);
            });
    }, []);

    return (
        <div className="home-container">
            <h2>Our Products</h2>
            <div className="card-grid">
                {productData.map((product) => (
                    <div className="product-card" key={product.id}>
                        <h3>{product.productName}</h3>
                        <p><strong>Price:</strong> ₹{product.productPrice}</p>
                        <p><strong>Description:</strong> {product.productDescription}</p>
                        <button>Add to Cart 🛒</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
