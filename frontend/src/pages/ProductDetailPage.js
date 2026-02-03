import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { FaShoppingCart, FaArrowLeft, FaCheck, FaCheckCircle, FaMinus, FaPlus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { getProductById } from '../services/api';
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Check if product is in cart
  const isInCart = product && cartItems.some(item => item._id === product._id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);

        if (response.success) {
          setProduct(response.data);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="dark" />
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <h4>Product Not Found</h4>
          <p>{error || 'The product you are looking for does not exist.'}</p>
          <button className="btn btn-dark" onClick={() => navigate('/products')}>
            Back to Products
          </button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <Container>
        <div className="breadcrumb-nav">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/products" className="breadcrumb-link">Products</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.category}</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>
      </Container>

      <Container className="product-detail-container">
        <Row>
          {/* Product Image */}
          <Col lg={6} md={6}>
            <div className="product-image-section">
              <div className="product-main-image">
                <img
                  src={product.image ? `/images/products/${product.image}` : '/images/placeholder-product.png'}
                  alt={product.name}
                  onError={(e) => e.target.src = '/images/placeholder-product.png'}
                />
              </div>
            </div>
          </Col>

          {/* Product Info */}
          <Col lg={6} md={6}>
            <div className="product-info-section">
              <div className="product-category-badge">{product.category}</div>

              <h1 className="product-detail-name">{product.name}</h1>

              {product.brand && <p className="product-brand">by {product.brand}</p>}

              <div className="product-detail-price">{formatPrice(product.price)}</div>


              {/* Quantity Selector */}
              {!isInCart && (
                <div className="quantity-selector">
                  <label className="quantity-label">Quantity</label>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <div className="quantity-display">{quantity}</div>
                    <button
                      className="quantity-btn"
                      onClick={incrementQuantity}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="product-actions">
                <button
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={isInCart}
                >
                  {isInCart ? (
                    <>
                      <FaCheck /> In Cart
                    </>
                  ) : (
                    <>
                      <FaShoppingCart /> Add to Cart
                    </>
                  )}
                </button>

                <button className="back-btn" onClick={() => navigate(-1)}>
                  <FaArrowLeft /> Back
                </button>
              </div>

              {/* Description */}
              {product.description && (
                <div className="product-description-section">
                  <h3>About This Product</h3>
                  <p>{product.description}</p>
                </div>
              )}
            </div>
          </Col>
        </Row>

        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <Row>
            <Col lg={12}>
              <div className="specifications-section">
                <h2 className="section-title">Technical Specifications</h2>
                <div className="specifications-grid">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="specification-item">
                      <div className="spec-icon">✓</div>
                      <div className="spec-text">{spec}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

export default ProductDetailPage;