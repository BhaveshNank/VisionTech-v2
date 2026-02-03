import axios from 'axios';

// Base URL for your Flask backend
// TODO: Change this when backend URL changes
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});



// ============================================
// PRODUCT API CALLS
// ============================================

/**
 * Get all products from the backend
 * @returns {Promise} - Array of all products
 */
export const getAllProducts = async () => {
  try {
    const response = await api.get('/products/');
    return response.data; // Returns { success: true, data: [...] }
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};

/**
 * Get products by category
 * @param {string} category - Category name (e.g., 'laptop', 'phone')
 * @returns {Promise} - Array of products in that category
 */
export const getProductsByCategory = async (category) => {
  try {
    const response = await api.get(`/products/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    throw error;
  }
};

/**
 * Search products by query string
 * @param {string} query - Search term
 * @returns {Promise} - Array of matching products
 */
export const searchProducts = async (query) => {
  try {
    const response = await api.get('/products/search', {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

/**
 * Filter products by price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {Promise} - Array of products within price range
 */
export const filterProductsByPrice = async (minPrice, maxPrice) => {
  try {
    const response = await api.get('/products/filter', {
      params: { 
        min_price: minPrice,
        max_price: maxPrice
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error filtering products by price:', error);
    throw error;
  }
};

/**
 * Get single product details by ID
 * @param {string} productId - Product ID
 * @returns {Promise} - Single product object
 */
export const getProductById = async (productId) => {
  try {
    const response = await api.get(`/products/detail/id/${productId}`);  // ✅ Added /id/
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    throw error;
  }
};

/**
 * Get featured products
 * @returns {Promise} - Array of featured products
 */
export const getFeaturedProducts = async () => {
  try {
    const response = await api.get('/products/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

// ============================================
// CHAT API CALLS (Gemini AI)
// ============================================

/**
 * Send message to AI chatbot
 * @param {string} message - User's message
 * @param {boolean} includeProducts - Whether to include product context
 * @returns {Promise} - AI response
 */
export const sendChatMessage = async (message, includeProducts = false) => {
  try {
    const response = await api.post('/chat/', {
      message: message,
      include_products: includeProducts
    });
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

/**
 * Get chat conversation history
 * @returns {Promise} - Array of previous messages
 */
export const getChatHistory = async () => {
  try {
    const response = await api.get('/chat/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

/**
 * Reset chat conversation
 * @returns {Promise} - Success message
 */
export const resetChatHistory = async () => {
  try {
    const response = await api.post('/chat/reset');
    return response.data;
  } catch (error) {
    console.error('Error resetting chat:', error);
    throw error;
  }
};

// Export the axios instance for custom requests if needed 
export default api;