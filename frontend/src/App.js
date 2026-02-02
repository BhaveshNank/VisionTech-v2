import logo from './logo.svg';
import './App.css';
import Navbar from './components/layout/Navbar';

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Footer from './components/home/Footer';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccess from './pages/OrderSuccess';
import Chatbot from './components/chatbot/Chatbot';

function App() {
  return (
    // Router wraps everything - this enables routing throughout the app

    <CartProvider>
      <Router>
        <div className="App">

          <Navbar />
          {/* This is where pages will appear based on URL */}
          <Routes>
            {/* When user visits /, show HomePage */}
            <Route path="/" element={<HomePage />} />

            {/* When user visits /products, show ProductsPage */}
            <Route path="/products" element={<ProductsPage />} />

            {/* When user visits /products/123, show ProductDetailPage */}
            <Route path="/products/:id" element={<ProductDetailPage />} />

            {/* When user visits /cart, show CartPage */}
            <Route path="/cart" element={<CartPage />} />

            <Route path="/about" element={<AboutPage />} />

            <Route path="/contact" element={<ContactPage />} />

            {/* If URL doesn't match any route, show 404 */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />

            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccess />} />
          </Routes>
          
          <Footer />
          <Chatbot />

        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
