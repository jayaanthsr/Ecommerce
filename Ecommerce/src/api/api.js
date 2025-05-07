import axios from 'axios';

// Base URL for our backend API
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with baseURL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Product API
export const productApi = {
  getAllProducts: () => api.get('/products'),
  getProductById: (id) => api.get(`/products/${id}`),
  getProductsByCategory: (category) => api.get(`/products/category/${category}`),
  searchProducts: (query) => api.get(`/products/search?q=${query}`),
  
  // Admin APIs
  addProduct: (product) => api.post('/products', product),
  updateProduct: (id, product) => api.put(`/products/${id}`, product),
  deleteProduct: (id) => api.delete(`/products/${id}`)
};

// Order API
export const orderApi = {
  placeOrder: (order) => api.post('/orders', order),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getUserOrders: (emailId) => api.get(`/orders/user/${emailId}`),
  
  // Admin APIs
  getAllOrders: () => api.get('/orders'),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status })
};

// Categories API
export const categoryApi = {
  getAllCategories: () => api.get('/categories'),
  
  // Admin APIs
  addCategory: (category) => api.post('/categories', category),
  updateCategory: (id, category) => api.put(`/categories/${id}`, category),
  deleteCategory: (id) => api.delete(`/categories/${id}`)
};

// Stats API for Admin
export const statsApi = {
  getSalesStats: () => api.get('/stats/sales'),
  getProductStats: () => api.get('/stats/products')
};

export default {
  productApi,
  orderApi,
  categoryApi,
  statsApi
};