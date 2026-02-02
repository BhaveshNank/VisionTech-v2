import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import './DealsSection.css';

function DealsSection() {
  // Featured deal (large card on left)
  const featuredDeal = {
    id: 1,
    name: 'MacBook Pro M4',
    badge: 'Student Discount Available',
    subtitle: '10% Student Discount',
    price: 2159,
    originalPrice: 2399,
    savings: 240,
    image: '/images/products/macbook-m4-pro.jpg',
    link: '/products/1',
    featured: true
  };

  // Smaller deals (4 cards on right in 2x2 grid)
  const deals = [
    {
      id: 2,
      name: 'iPhone 16 Pro',
      description: 'Trade-in deals up to $800 off',
      image: '/images/products/iphone-16-pro-max.jpg',
      link: '/products/2'
    },
    {
      id: 3,
      name: 'Galaxy S24 Ultra',
      description: 'Free Galaxy Watch7 with purchase',
      image: '/images/products/galaxy-s24-ultra.jpg',
      link: '/products/3'
    },
    {
      id: 4,
      name: 'Sony 65" BRAVIA',
      description: 'Extra 15% off with soundbar bundle',
      image: '/images/products/sony-bravia.jpg',
      link: '/products/4'
    },
    {
      id: 5,
      name: 'ASUS ROG Laptop',
      description: 'Gaming bundle worth $300 included',
      image: '/images/products/asus_rog_strix_g16.jpg',
      link: '/products/5'
    }
  ];

  return (
    <section className="deals-section">
      <Container>
        {/* Section Header */}
        <div className="section-header-deals">
          <h2 className="section-title-deals">Latest Offers & Deals</h2>
          <div className="title-underline-deals"></div>
        </div>

        {/* Deals Grid */}
        <Row className="deals-grid">
          {/* LEFT: Featured Deal (Large Card) */}
          <Col lg={7} md={12} className="mb-4">
            <div className="featured-deal-card">
              {/* Badge */}
              <Badge bg="dark" className="deal-badge">
                {featuredDeal.badge}
              </Badge>

              <Row className="align-items-center h-100">
                {/* Left: Text Content */}
                <Col md={6} className="featured-deal-content">
                  <h3 className="featured-deal-name">{featuredDeal.name}</h3>
                  <p className="featured-deal-subtitle">{featuredDeal.subtitle}</p>
                  
                  <div className="featured-pricing">
                    <div className="featured-current-price">
                      ${featuredDeal.price.toLocaleString()}
                    </div>
                    <div className="featured-original-price">
                      ${featuredDeal.originalPrice.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="featured-savings">
                    Save ${featuredDeal.savings}
                  </div>

                  <Link 
                    to={featuredDeal.link} 
                    className="btn-shop-now"
                  >
                    Shop Now
                  </Link>
                </Col>

                {/* Right: Product Image */}
                <Col md={6} className="featured-deal-image-col">
                  <div className="featured-deal-image-wrapper">
                    <img 
                      src={featuredDeal.image} 
                      alt={featuredDeal.name}
                      className="featured-deal-image"
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Col>

          {/* RIGHT: Smaller Deals (2x2 Grid) */}
          <Col lg={5} md={12}>
            <Row>
              {deals.map((deal) => (
                <Col md={6} sm={6} key={deal.id} className="mb-4">
                  <Link to={deal.link} className="small-deal-card">
                    {/* Product Image */}
                    <div className="small-deal-image-wrapper">
                      <img 
                        src={deal.image} 
                        alt={deal.name}
                        className="small-deal-image"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="small-deal-info">
                      <h4 className="small-deal-name">{deal.name}</h4>
                      <p className="small-deal-description">{deal.description}</p>
                      
                      <div className="small-deal-link">
                        Learn more <FaArrowRight className="arrow-icon" />
                      </div>
                    </div>
                  </Link>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default DealsSection;