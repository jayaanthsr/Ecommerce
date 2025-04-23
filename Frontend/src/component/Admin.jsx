import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import "./styles/Admin.css";

function Admin() {
    const [productData, setProductData] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/admin/display");
            setProductData(response.data);
        } catch (error) {
            toast.error("Error fetching products");
            console.error("Error fetching products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddProduct = async (productData) => {
        setIsLoading(true);
        try {
            await axios.post("http://localhost:8080/admin/add", productData);
            toast.success("Product added successfully");
            fetchProducts();
            return true;
        } catch (error) {
            toast.error("Failed to add product");
            console.error("Add product error:", error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProduct = async (id, productData) => {
        setIsLoading(true);
        try {
            await axios.put(`http://localhost:8080/admin/update/${id}`, productData);
            toast.success("Product updated successfully");
            setEditingProduct(null);
            fetchProducts();
            return true;
        } catch (error) {
            toast.error("Failed to update product");
            console.error("Update product error:", error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        setIsLoading(true);
        try {
            await axios.delete(`http://localhost:8080/admin/delete/${id}`);
            toast.success("Product deleted successfully");
            fetchProducts();
        } catch (error) {
            toast.error("Failed to delete product");
            console.error("Delete product error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const startEditing = (product) => {
        setEditingProduct(product);
    };

    const cancelEditing = () => {
        setEditingProduct(null);
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
            </div>

            <div className="admin-container">
                <div className="admin-sidebar">
                    <h2>Administration</h2>
                    <ul className="admin-menu">
                        <li className="active">Products</li>
                        <li>Orders</li>
                        <li>Customers</li>
                        <li>Reports</li>
                        <li>Settings</li>
                    </ul>
                </div>

                <div className="admin-content">
                    <section className="admin-section">
                        <h2>{editingProduct ? "Update Product" : "Add New Product"}</h2>
                        <ProductForm
                            initialProduct={editingProduct}
                            onSubmit={editingProduct
                                ? (data) => handleUpdateProduct(editingProduct.id, data)
                                : handleAddProduct}
                            onCancel={cancelEditing}
                            isLoading={isLoading}
                        />
                    </section>

                    <section className="admin-section">
                        <div className="section-header">
                            <h2>Product Inventory</h2>
                            {isLoading && <div className="loader"></div>}
                        </div>
                        <ProductTable
                            products={productData}
                            onEdit={startEditing}
                            onDelete={handleDeleteProduct}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Admin;