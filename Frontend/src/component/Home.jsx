import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Home.css";
import Navbar from "./Navbar.jsx";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

function Home() {
    const [productData, setProductData] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get("http://localhost:8080/admin/display")
            .then((res) => {
                setProductData(res.data);
            })
            .catch((err) => {
                console.log("Error fetching products:", err);
            });
    }, []);
    const userName = localStorage.getItem("userName");
    const addToCart = (id) => {
        if (localStorage.getItem("isLogged") === "user") {


            axios.post("http://localhost:8080/user/addToCart", { username:userName, productId:id })
                .then(() => {
                    console.log({ username: userName, productId: id });

                    toast.success("The product was added to the cart", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                })
                .catch((err) => {
                    console.log({ username: userName, productId: id });
                    console.log(err);
                    toast.error("Failed to add the product to the cart", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                });
        }

    }
    return (
        <>

        <div className="home-container">

            <h2>Our Products</h2>
            <div className="card-grid">
                {productData.map((product) => (
                    <div className="product-card" key={product.id}>
                        <h3>{product.productName}</h3>
                        <p><strong>Price:</strong> ₹{product.productPrice}</p>
                        <p><strong>Description:</strong> {product.productDescription}</p>
                        <button onClick={()=>addToCart(product.id)}>Add to Cart 🛒</button>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
}

export default Home;
