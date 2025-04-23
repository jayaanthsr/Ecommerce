import PropTypes from "prop-types";

function ProductTable({ products, onEdit, onDelete }) {
    if (!products || products.length === 0) {
        return (
            <div className="empty-state">
                <p>No products found. Add your first product to get started.</p>
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="product-table">
                <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price (₹)</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                        <td className="product-image-cell">
                            {product.productImage ? (
                                <img
                                    src={product.productImage}
                                    alt={product.productName}
                                    className="product-thumbnail"
                                />
                            ) : (
                                <div className="no-image">No Image</div>
                            )}
                        </td>
                        <td>{product.productName}</td>
                        <td>₹{product.productPrice.toLocaleString()}</td>
                        <td>{product.productCategory || "Uncategorized"}</td>
                        <td>{product.productStock || "N/A"}</td>
                        <td className="description-cell">
                            <div className="truncated-text">{product.productDescription}</div>
                        </td>
                        <td className="actions-cell">
                            <button
                                className="btn-icon edit-btn"
                                onClick={() => onEdit(product)}
                                title="Edit product"
                            >
                                <span className="icon">✏️</span>
                            </button>
                            <button
                                className="btn-icon delete-btn"
                                onClick={() => onDelete(product.id)}
                                title="Delete product"
                            >
                                <span className="icon">🗑️</span>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

ProductTable.propTypes = {
    products: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default ProductTable;