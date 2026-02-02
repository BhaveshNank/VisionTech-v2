import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaRocket, FaUsers, FaShieldAlt, FaAward } from 'react-icons/fa';
import './AboutPage.css';

function AboutPage() {
  const values = [
    {
      icon: <FaRocket />,
      title: 'Innovation',
      description: 'Bringing cutting-edge technology to your fingertips with the latest products and solutions.'
    },
    {
      icon: <FaUsers />,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We provide exceptional service and support at every step.'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Quality Assured',
      description: 'Every product is carefully selected and verified to meet the highest quality standards.'
    },
    {
      icon: <FaAward />,
      title: 'Excellence',
      description: 'Committed to delivering excellence in products, service, and customer experience.'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={12} className="text-center">
              <h1 className="about-hero-title">About VisionTech</h1>
              <p className="about-hero-subtitle">
                Your Trusted Partner in Premium Electronics
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Story Section */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="about-story">
              <h2 className="section-title text-center mb-4">Our Story</h2>
              <p className="story-text">
                Founded with a vision to revolutionize the electronics retail experience, VisionTech has been at the forefront of bringing premium technology products to tech enthusiasts and professionals alike. We understand that in today's fast-paced digital world, having access to the latest and most reliable technology is not just a luxury—it's a necessity.
              </p>
              <p className="story-text">
                From smartphones and laptops to gaming gear and audio equipment, we curate only the finest products from world-renowned brands. Our commitment goes beyond just selling products; we aim to build lasting relationships with our customers by providing expert guidance, exceptional after-sales support, and a seamless shopping experience.
              </p>
              <p className="story-text">
                What sets VisionTech apart is our passion for technology and our dedication to helping customers make informed decisions. Whether you're a professional looking for productivity tools, a gamer seeking the ultimate setup, or someone who simply appreciates quality electronics, VisionTech is here to serve you.
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Values Section */}
      <div className="values-section py-5">
        <Container>
          <h2 className="section-title text-center mb-5">Our Core Values</h2>
          <Row className="g-4">
            {values.map((value, index) => (
              <Col lg={3} md={6} key={index}>
                <Card className="value-card h-100 text-center">
                  <Card.Body>
                    <div className="value-icon mb-3">
                      {value.icon}
                    </div>
                    <h5 className="value-title">{value.title}</h5>
                    <p className="value-description">{value.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Mission Section */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="mission-section text-center">
              <h2 className="section-title mb-4">Our Mission</h2>
              <p className="mission-text">
                To empower individuals and businesses with cutting-edge technology solutions that enhance productivity, creativity, and connectivity. We strive to make premium electronics accessible while maintaining the highest standards of quality, service, and customer satisfaction.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AboutPage;