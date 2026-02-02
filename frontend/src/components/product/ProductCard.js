import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useCart } from '../../context/CartContext'; // ← ONLY ADD THIS
import './ProductCard.css';

function ProductCard({ product, compact = false }) {
  const { addToCart, cartItems } = useCart(); // ← ONLY ADD THIS

  // Check if item is in cart - ONLY ADD THIS
  const isInCart = cartItems.some(item => item._id === product._id);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Get first 3 specifications as bullet points
  const getSpecificationPoints = () => {
    if (!product.specifications || product.specifications.length === 0) {
      return [];
    }
    // Return first 3 specifications
    return product.specifications.slice(0, 3);
  };

  const specPoints = getSpecificationPoints();

  if (compact) {
    return (
      <div className="product-card-compact" onClick={() => window.location.href = `/products/${product._id}`}>
        <div className="product-image-compact">
          <img
            src={product.image ? `/images/products/${product.image}` : '/images/placeholder-product.png'}
            alt={product.name}
            onError={(e) => e.target.src = '/images/placeholder-product.png'}
          />
        </div>

        <div className="product-info-compact">
          <h6 className="product-name-compact">{product.name}</h6>
          <p className="product-category-compact">{product.category}</p>
          <p className="product-price-compact">{formatPrice(product.price)}</p>

          <div className="product-actions-compact">
            <Link
              to={`/products/${product._id}`}
              className="btn-view-compact"
              onClick={(e) => e.stopPropagation()}
            >
              View
            </Link>
            <button
              className="btn-cart-compact"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={product.stock === 0}
            >
              {isInCart ? 'In Cart' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle add to cart - ONLY ADD THIS
  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <Card className="product-card h-100">
      {/* Product Image */}
      <Link to={`/products/${product._id}`} className="product-image-link">
        <div className="product-image-wrapper">
          <Card.Img
            variant="top"
            src={product.image ? `/images/products/${product.image}` : '/images/placeholder-product.png'}
            alt={product.name}
            className="product-image"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.src = '/images/placeholder-product.png';
            }}
          />
          {product.stock === 0 && (
            <div className="out-of-stock-badge">Out of Stock</div>
          )}
        </div>
      </Link>

      <Card.Body className="product-card-body">
        {/* Brand Badge */}
        <div className="category-badge">
          {product.brand || product.category}
        </div>

        {/* Product Name */}
        <Link to={`/products/${product._id}`} className="product-name-link">
          <Card.Title className="product-name">
            {product.name}
          </Card.Title>
        </Link>

        {/* Product Price */}
        <div className="product-price">
          {formatPrice(product.price)}
        </div>

        {/* Product Specifications as Bullet Points */}
        {specPoints.length > 0 && (
          <div className="product-description">
            <ul>
              {specPoints.map((spec, index) => (
                <li key={index}>{spec}</li>
              ))}
              {product.specifications && product.specifications.length > 3 && (
                <li className="more-specs">
                  +{product.specifications.length - 3} more features
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Buttons */}
        <div className="product-footer">
          <Link
            to={`/products/${product._id}`}
            className="view-details-button"
          >
            View Details
          </Link>

          <Button
            variant="outline-primary"
            className="add-to-cart-button"
            onClick={handleAddToCart}  // ← ONLY CHANGE: Added onClick
            disabled={product.stock === 0}
          >
            {isInCart ? (  // ← ONLY CHANGE: Dynamic button text
              <>
                <FaCheck className="cart-icon" />
                In Cart
              </>
            ) : (
              <>
                <FaShoppingCart className="cart-icon" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;