import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaTruck, FaExchangeAlt, FaLock, FaGift } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './ExperienceSection.css';

function ExperienceSection() {
  // Features data
  const features = [
    {
      id: 1,
      icon: <FaTruck />,
      title: 'Free Delivery',
      description: 'Fast shipping on orders over $75',
      iconBg: 'blue',
      link: '/shipping'
    },
    {
      id: 2,
      icon: <FaExchangeAlt />,
      title: 'Easy Returns',
      description: '30-day hassle-free returns',
      iconBg: 'green',
      link: '/returns'
    },
    {
      id: 3,
      icon: <FaLock />,
      title: 'Secure Payment',
      description: 'Your data is safe and encrypted',
      iconBg: 'red',
      link: '/security'
    },
    {
      id: 4,
      icon: <FaGift />,
      title: 'Rewards Program',
      description: 'Earn points with every purchase',
      iconBg: 'yellow',
      link: '/rewards'
    }
  ];

  return (
    <section className="experience-section">
      <Container>
        {/* Section Header */}
        <div className="experience-header">
          <h2 className="experience-title">The VisionTech Experience</h2>
          <div className="experience-underline"></div>
          <p className="experience-subtitle">What makes us different</p>
        </div>

        {/* Features Grid */}
        <Row className="features-grid">
          {features.map((feature) => (
            <Col lg={3} md={6} sm={6} key={feature.id} className="mb-4">
              <div className="feature-card">
                {/* Icon */}
                <div className={`feature-icon-wrapper icon-bg-${feature.iconBg}`}>
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>

                {/* Learn More Link */}
                <Link to={feature.link} className="feature-link">
                  Learn more →
                </Link>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default ExperienceSection;