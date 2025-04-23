import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function ProductForm({ initialProduct, onSubmit, onCancel, isLoading }) {
    const defaultFormState = {
        productName: "",
        productPrice: "",
        productDescription: "",
        productImage: "",
        productCategory: "",
        productStock: ""
    };

    const [formData, setFormData] = useState(defaultFormState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialProduct) {
            setFormData({
                productName: initialProduct.productName || "",
                productPrice: initialProduct.productPrice || "",
                productDescription: initialProduct.productDescription || "",
                productImage: initialProduct.productImage || "",
                productCategory: initialProduct.productCategory || "",
                productStock: initialProduct.productStock || ""
            });
        } else {
            setFormData(defaultFormState);
        }
    }, [initialProduct]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.productName.trim()) {
            newErrors.productName = "Product name is required";
        }

        if (!formData.productPrice) {
            newErrors.productPrice = "Price is required";
        } else if (isNaN(formData.productPrice) || Number(formData.productPrice) <= 0) {
            newErrors.productPrice = "Price must be a positive number";
        }

        if (!formData.productDescription.trim()) {
            newErrors.productDescription = "Description is required";
        }

        if (!formData.productCategory.trim()) {
            newErrors.productCategory = "Category is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const productData = {
            ...formData,
            productPrice: parseFloat(formData.productPrice),
            productStock: formData.productStock ? parseInt(formData.productStock) : 0
        };

        const success = await onSubmit(productData);
        if (success) {
            setFormData(defaultFormState);
        }
    };

    return (
        <form className="product-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="productName">Product Name*</label>
                    <input
                        type="text"
                        id="productName"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        className={errors.productName ? "error" : ""}
                    />
                    {errors.productName && <div className="error-message">{errors.productName}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="productPrice">Price (₹)*</label>
                    <input
                        type="number"
                        id="productPrice"
                        name="productPrice"
                        value={formData.productPrice}
                        onChange={handleChange}
                        step="0.01"
                        className={errors.productPrice ? "error" : ""}
                    />
                    {errors.productPrice && <div className="error-message">{errors.productPrice}</div>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="productCategory">Category*</label>
                    <input
                        type="text"
                        id="productCategory"
                        name="productCategory"
                        value={formData.productCategory}
                        onChange={handleChange}
                        placeholder="e.g. Electronics, Fashion"
                        className={errors.productCategory ? "error" : ""}
                    />
                    {errors.productCategory && <div className="error-message">{errors.productCategory}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="productStock">Stock Quantity</label>
                    <input
                        type="number"
                        id="productStock"
                        name="productStock"
                        value={formData.productStock}
                        onChange={handleChange}
                        placeholder="Available quantity"
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="productImage">Image URL</label>
                <input
                    type="text"
                    id="productImage"
                    name="productImage"
                    value={formData.productImage}
                    onChange={handleChange}
                    placeholder="Paste image URL here"
                />
                {formData.productImage && (
                    <div className="image-preview">
                        <img src={formData.productImage} alt="Product preview" />
                    </div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="productDescription">Description*</label>
                <textarea
                    id="productDescription"
                    name="productDescription"
                    value={formData.productDescription}
                    onChange={handleChange}
                    rows="4"
                    className={errors.productDescription ? "error" : ""}
                ></textarea>
                {errors.productDescription && <div className="error-message">{errors.productDescription}</div>}
            </div>

            <div className="form-actions">
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={isLoading}
                >
                    {isLoading ? "Processing..." : initialProduct ? "Update Product" : "Add Product"}
                </button>

                {initialProduct && (
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}

ProductForm.propTypes = {
    initialProduct: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
};

export default ProductForm;