import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './GamingSection.css';

function GamingSection() {
  return (
    <section className="gaming-section">
      {/* Gaming Hero Banner */}
      <div className="gaming-hero">
        <div className="gaming-hero-content">

          <h2 className="gaming-hero-title">
            UNLEASH GAMING <span className="gradient-text">POWER</span>
          </h2>

          
          <p className="gaming-hero-subtitle">PERFORMANCE BEYOND LIMITS</p>
        </div>
        <div className="gaming-hero-image">
          <img 
            src="/images/gaming/rogstrix.jpg" 
            alt="Gaming Laptops"
            className="hero-laptops-image"
          />
        </div>
        <div className="gaming-hero-buttons">
          <Link to="/products?category=gaming" className="btn-gaming-primary">
            BUY NOW
          </Link>
          <Link to="/products?category=gaming" className="btn-gaming-secondary">
            ENQUIRE →
          </Link>
        </div>
      </div>

      {/* Gaming Products Grid */}
      <Container fluid className="gaming-products-container p-0">
        <Row className="g-0">
          {/* Gaming Audio Card */}
          <Col lg={6} className="p-0">
            <div className="gaming-product-card card-purple">
              <div className="gaming-card-content">
                <h3 className="gaming-card-title">Gaming Audio</h3>
                <p className="gaming-card-description">
                  Immerse yourself in crystal-clear audio with premium gaming headphones designed for competitive advantage.
                </p>
                <div className="gaming-card-buttons">
                  <Link to="/products?category=audio" className="btn-card-primary">
                    BUY NOW
                  </Link>
                  <Link to="/products?category=audio" className="btn-card-secondary">
                    ENQUIRE
                  </Link>
                </div>
              </div>
              <div className="gaming-card-image">
                <img 
                  src="/images/gaming/gaming-headphones.jpg" 
                  alt="Gaming Headphones"
                />
              </div>
            </div>
          </Col>

          {/* Precision Control Card */}
          <Col lg={6} className="p-0">
            <div className="gaming-product-card card-blue">
              <div className="gaming-card-content">
                <h3 className="gaming-card-title">Precision Control</h3>
                <p className="gaming-card-description">
                  Achieve pixel-perfect accuracy with high-performance gaming mice built for speed and precision.
                </p>
                <div className="gaming-card-buttons">
                  <Link to="/products?category=gaming" className="btn-card-primary">
                    BUY NOW
                  </Link>
                  <Link to="/products?category=gaming" className="btn-card-secondary">
                    ENQUIRE
                  </Link>
                </div>
              </div>
              <div className="gaming-card-image">
                <img 
                  src="/images/gaming/gamingmouse.jpg" 
                  alt="Gaming Mice"
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default GamingSection;