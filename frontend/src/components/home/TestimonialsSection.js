import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import './TestimonialsSection.css';

function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      image: '/images/testimonials/testimonial1.jpg',
      rating: 5,
      text: 'The AI recommendations were spot on! Found the perfect laptop for my needs within minutes.',
    },
    {
      id: 2,
      name: 'Michael Chen',
      image: '/images/testimonials/testimonial2.jpg',
      rating: 5,
      text: 'Excellent customer service and fast delivery. My go-to store for all electronics.',
    },
    {
      id: 3,
      name: 'Emily Davis',
      image: '/images/testimonials/testimonial3.jpg',
      rating: 5,
      text: 'Great prices and the extended warranty gives me peace of mind. Highly recommend!',
    },
  ];

  // Render star rating
  const renderStars = (rating) => {
    return [...Array(rating)].map((_, index) => (
      <FaStar key={index} className="star-icon" />
    ));
  };

  return (
    <section className="testimonials-section">
      <Container>
        {/* Section Header */}
        <div className="testimonials-header">
          <h2 className="testimonials-title">What Our Customers Say</h2>
          <div className="title-underline"></div>
          <p className="testimonials-subtitle">Real experiences from real customers</p>
        </div>

        {/* Testimonials Grid */}
        <Row className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <Col key={testimonial.id} lg={4} md={4} className="testimonial-col">
                
              <div className="testimonial-card">
                {/* Customer Image */}
                <div className="customer-image-wrapper">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="customer-image"
                  />
                </div>

                {/* Star Rating */}
                <div className="rating">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Testimonial Text */}
                <p className="testimonial-text">
                  {testimonial.text}
                </p>

                {/* Customer Name */}
                <p className="customer-name">— {testimonial.name}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default TestimonialsSection;