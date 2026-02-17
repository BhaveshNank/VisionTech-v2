import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './FeaturedProducts.css';

function FeaturedProducts() {
  const featuredProducts = [
    {
      id: 1,
      name: 'iPhone 16 Pro Max',
      category: 'Flagship Performance',
      price: 1199.00,
      originalPrice: 1299.00,
      image: '/images/products/iphone-16-pro-max.jpg',
      description: 'Experience the ultimate in mobile technology with A17 Pro chip and titanium design.',
      link: '/products/1'
    },
    {
      id: 2,
      name: 'Samsung Galaxy S25 Ultra',
      category: 'AI Revolution',
      price: 1149.00,
      originalPrice: 1299.00,
      image: 'images/products/samsung-s25-ultra.jpg',
      description: 'Next-gen Galaxy AI is here. Transform your mobile experience with advanced AI features.',
      link: '/products/2'
    },
    {
      id: 3,
      name: 'Google Pixel 9 Pro XL',
      category: 'Pure Android Experience',
      price: 999.00,
      originalPrice: 1099.00,
      image: '/images/products/pixel-9-pro-xl.jpg',
      description: 'The most helpful Pixel yet, with advanced AI and the best Pixel camera system.',
      link: '/products/3'
    },
    {
      id: 4,
      name: 'MacBook M4 Pro',
      category: 'Professional Power',
      price: 1999.00,
      originalPrice: 2199.00,
      image: '/images/products/macbook-m4-pro.jpg',
      description: 'Revolutionary M4 chip delivers unprecedented performance for professionals and creators.',
      link: '/products/4'
    },
    {
      id: 5,
      name: 'Lenovo LOQ',
      category: 'Slim & Powerful',
      price: 849.00,
      originalPrice: 999.00,
      image: '/images/products/lenovo-loq.jpg',
      description: 'Ultra-slim design meets gaming performance. Perfect for work and entertainment.',
      link: '/products/5'
    }
  ];

  // Scroll functionality
  const scrollContainer = React.useRef(null);

  const scroll = (direction) => {
    const container = scrollContainer.current;
    if (container) {
      const scrollAmount = 350; 
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="featured-products-section">
      <Container>
        {/* Section Header */}
        <div className="section-header">
          <div className="section-title-wrapper">
            <h2 className="section-title">New on VisionTech</h2>
            <div className="title-underline"></div>
          </div>
          <Link to="/products" className="view-all-btn">
            View all
          </Link>
        </div>

        {/* Products Carousel */}
        <div className="carousel-wrapper">
          {/* Left Arrow */}
          <button 
            className="carousel-arrow carousel-arrow-left" 
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <FaChevronLeft />
          </button>

          {/* Products Container */}
          <div className="products-scroll-container" ref={scrollContainer}>
            {featuredProducts.map((product) => (
              <div key={product.id} className="product-card">
                {/* Product Image */}
                <div className="product-image-wrapper">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="product-image"
                  />
                </div>

                {/* Product Info */}
                <div className="product-info">
                  <p className="product-category">{product.category}</p>
                  <h3 className="product-name">{product.name}</h3>
                  
                  {/* Price */}
                  <div className="product-pricing">
                    <span className="current-price">
                      From ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="original-price">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="product-description">{product.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="product-actions">
                  <Button 
                    as={Link} 
                    to={product.link} 
                    className="btn-buy-now"
                    variant="dark"
                  >
                    Buy now
                  </Button>
                  <Button 
                    as={Link} 
                    to={product.link} 
                    className="btn-enquire"
                    variant="outline-dark"
                  >
                    Enquire
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button 
            className="carousel-arrow carousel-arrow-right" 
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <FaChevronRight />
          </button>
        </div>
      </Container>
    </section>
  );
}

export default FeaturedProducts;