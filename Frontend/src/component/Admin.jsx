import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Admin.css"

function Admin() {
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productData, setProductData] = useState([]);

    useEffect(() => {
        displayProductList();
    }, []);

    const displayProductList = () => {
        axios.get("http://localhost:8080/admin/display").then((res) => {
            setProductData(res.data);
        });
    };

    const Add = () => {
        axios
            .post("http://localhost:8080/admin/add", {
                productName: productName,
                productPrice: parseInt(productPrice),
                productDescription: productDescription,
            })
            .then((res) => {
                alert("Successfully added");
                setProductName("");
                setProductPrice("");
                setProductDescription("");
                displayProductList();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:8080/admin/delete/${id}`)
            .then(() => {
                alert("Product deleted");
                displayProductList();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="admin-container">
            <h2>Add Product</h2>
            <form className="product-form">
                <label>Product Name:</label>
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                />
                <label>Product Price:</label>
                <input
                    type="text"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    required
                />
                <label>Product Description:</label>
                <input
                    type="text"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    required
                />
                <button type="button" onClick={Add}>
                    Submit
                </button>
            </form>

            <h2>Product List</h2>
            <table className="product-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Price ₹</th>
                    <th>Description</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {productData.map((product) => (
                    <tr key={product.id}>
                        <td>{product.productName}</td>
                        <td>{product.productPrice}</td>
                        <td>{product.productDescription}</td>
                        <td>
                            <button onClick={() => handleDelete(product.id)}>🗑️ Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Admin;
