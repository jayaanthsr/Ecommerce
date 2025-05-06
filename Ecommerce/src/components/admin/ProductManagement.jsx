import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import { productApi, categoryApi } from '../../api/api';
import '../../styles/ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    stock: '',
    onSale: false,
    salePercentage: ''
  });
  
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        // Using mock data until backend is ready

        const productsResponse = await productApi.getAllProducts();
        setProducts(productsResponse.data);
        
        const categoriesResponse = await categoryApi.getAllCategories();
        setCategories(categoriesResponse.data);

        


      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductsAndCategories();
  }, []);
  
  // Filter and sort products
  const filteredAndSortedProducts = () => {
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
    
    // Sort products
    result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Convert strings to appropriate types for comparison
      if (sortField === 'price' || sortField === 'stock') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return result;
  };
  
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleCategoryFilter = (e) => {
    setSelectedCategory(e.target.value);
  };
  
  const handleOpenModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        image: product.image,
        stock: product.stock,
        onSale: product.onSale,
        salePercentage: product.salePercentage || ''
      });
    } else {
      setCurrentProduct(null);
      setFormData({
        name: '',
        price: '',
        category: '',
        description: '',
        image: '',
        stock: '',
        onSale: false,
        salePercentage: ''
      });
    }
    
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        salePercentage: formData.onSale ? parseInt(formData.salePercentage) : 0
      };
      
      if (currentProduct) {
        // Update existing product

        await productApi.updateProduct(currentProduct.id, productData);

        
        // Update in local state

      } else {
        // Add new product

        const response = await productApi.addProduct(productData);
        const newProduct = response.data;

        
        // Add to local state

        setProducts([...products, newProduct]);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };
  
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {

        await productApi.deleteProduct(id);

        
        // Remove from local state

      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };
  
  if (loading) {
    return <div className="loading">Loading products...</div>;
  }
  
  return (
    <div className="product-management">
      <div className="management-header">
        <h1 className="page-title">Product Management</h1>
        <button 
          className="btn btn-primary add-product-btn"
          onClick={() => handleOpenModal()}
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>
      
      <div className="management-controls">
        <div className="search-input-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <Filter size={16} className="filter-icon" />
          <select 
            value={selectedCategory} 
            onChange={handleCategoryFilter}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th className="product-image-col">Image</th>
              <th 
                className={`sortable ${sortField === 'name' ? 'active' : ''}`}
                onClick={() => handleSort('name')}
              >
                <div className="sort-header">
                  <span>Name</span>
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th 
                className={`sortable ${sortField === 'category' ? 'active' : ''}`}
                onClick={() => handleSort('category')}
              >
                <div className="sort-header">
                  <span>Category</span>
                  {sortField === 'category' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th 
                className={`sortable ${sortField === 'price' ? 'active' : ''}`}
                onClick={() => handleSort('price')}
              >
                <div className="sort-header">
                  <span>Price</span>
                  {sortField === 'price' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th 
                className={`sortable ${sortField === 'stock' ? 'active' : ''}`}
                onClick={() => handleSort('stock')}
              >
                <div className="sort-header">
                  <span>Stock</span>
                  {sortField === 'stock' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th>Sale</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedProducts().map(product => (
              <tr key={product.id}>
                <td className="product-image-cell">
                  <img src={product.image} alt={product.name} className="product-thumbnail" />
                </td>
                <td className="product-name-cell">
                  <div className="product-name">{product.name}</div>
                  <div className="product-id">ID: {product.id}</div>
                </td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <span className={`stock-badge ${product.stock < 10 ? 'low-stock' : ''}`}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  {product.onSale ? (
                    <span className="sale-badge">{product.salePercentage}% OFF</span>
                  ) : (
                    <span className="no-sale">No</span>
                  )}
                </td>
                <td className="actions-cell">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleOpenModal(product)}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{currentProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Product Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price ($)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="stock">Stock</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="image">Image URL</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <div className="form-row sale-section">
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="onSale"
                      checked={formData.onSale}
                      onChange={handleInputChange}
                    />
                    On Sale
                  </label>
                </div>
                
                {formData.onSale && (
                  <div className="form-group">
                    <label htmlFor="salePercentage">Discount Percentage (%)</label>
                    <input
                      type="number"
                      id="salePercentage"
                      name="salePercentage"
                      value={formData.salePercentage}
                      onChange={handleInputChange}
                      min="1"
                      max="99"
                      required={formData.onSale}
                    />
                  </div>
                )}
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;