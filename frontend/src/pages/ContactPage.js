import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Accordion } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import './ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShowSuccess(true);
    
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });

    setTimeout(() => setShowSuccess(false), 5000);
  };

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: 'Email Us',
      content: 'support@visiontech.com',
      subContent: 'sales@visiontech.com'
    },
    {
      icon: <FaPhone />,
      title: 'Call Us',
      content: '+1 (555) 123-4567',
      subContent: 'Mon-Fri: 9AM - 6PM'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Visit Us',
      content: '123 Tech Avenue',
      subContent: 'San Francisco, CA 94102'
    },
    {
      icon: <FaClock />,
      title: 'Business Hours',
      content: 'Monday - Friday: 9AM - 6PM',
      subContent: 'Saturday: 10AM - 4PM'
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: 'What are your shipping options?',
      answer: 'We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Free shipping is available on orders over $500.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of purchase. Products must be unused and in original packaging. Refunds are processed within 5-7 business days.'
    },
    {
      question: 'Do you offer warranty on products?',
      answer: 'Yes! All products come with manufacturer\'s warranty. Extended warranty options are available at checkout for additional protection.'
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can track your package using this number on our shipping partner\'s website or in your account dashboard.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Currently, we ship within the United States only. We\'re working on expanding our shipping options to include international destinations in the near future.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay. All transactions are secured with SSL encryption.'
    },
    {
      question: 'Can I cancel or modify my order?',
      answer: 'Orders can be cancelled or modified within 2 hours of placement. After that, the order is processed and cannot be changed. Please contact our support team immediately if you need to make changes.'
    },
    {
      question: 'Do you offer technical support?',
      answer: 'Yes! We provide free technical support for all products purchased from VisionTech. You can reach our support team via phone, email, or live chat during business hours.'
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={12} className="text-center">
              <h1 className="contact-hero-title">Get In Touch</h1>
              <p className="contact-hero-subtitle">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Contact Info Cards */}
      <Container className="py-5">
        <Row className="g-4 mb-5">
          {contactInfo.map((info, index) => (
            <Col lg={3} md={6} key={index}>
              <Card className="contact-info-card h-100 text-center">
                <Card.Body>
                  <div className="contact-icon mb-3">
                    {info.icon}
                  </div>
                  <h5 className="contact-info-title">{info.title}</h5>
                  <p className="contact-info-content mb-1">{info.content}</p>
                  <p className="contact-info-subcontent">{info.subContent}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Contact Form & Map */}
        <Row className="g-4">
          {/* Contact Form */}
          <Col lg={7}>
            <Card className="contact-form-card">
              <Card.Body className="p-4">
                <h3 className="form-title mb-4">Send Us a Message</h3>
                
                {showSuccess && (
                  <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
                    <strong>Success!</strong> Your message has been sent. We'll get back to you soon!
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Your Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Your Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Subject</Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="How can we help you?"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Message</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={6}
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Write your message here..."
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Button type="submit" className="submit-button w-100">
                        Send Message
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Additional Info */}
          <Col lg={5}>
            <Card className="additional-info-card h-100">
              <Card.Body className="p-4">
                <h3 className="form-title mb-4">Why Contact Us?</h3>
                
                <div className="info-item mb-4">
                  <h6 className="info-item-title">🛒 Pre-Sales Inquiries</h6>
                  <p className="info-item-text">
                    Need help choosing the right product? Our experts are here to guide you.
                  </p>
                </div>

                <div className="info-item mb-4">
                  <h6 className="info-item-title">🔧 Technical Support</h6>
                  <p className="info-item-text">
                    Having issues with your product? Get technical assistance from our support team.
                  </p>
                </div>

                <div className="info-item mb-4">
                  <h6 className="info-item-title">📦 Order & Shipping</h6>
                  <p className="info-item-text">
                    Questions about your order status or shipping? We're here to help.
                  </p>
                </div>

                <div className="info-item mb-4">
                  <h6 className="info-item-title">💼 Business Partnerships</h6>
                  <p className="info-item-text">
                    Interested in partnering with VisionTech? Let's discuss opportunities.
                  </p>
                </div>

                <div className="response-time-box mt-4">
                  <h6 className="text-center mb-2">⏱️ Response Time</h6>
                  <p className="text-center mb-0">
                    We typically respond within <strong>24 hours</strong> on business days.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* FAQ Section with Accordion */}
      <div className="faq-section py-5">
        <Container>
          <h2 className="section-title text-center mb-5">Frequently Asked Questions</h2>
          <Row className="justify-content-center">
            <Col lg={10}>
              <Accordion defaultActiveKey="0">
                {faqs.map((faq, index) => (
                  <Accordion.Item eventKey={index.toString()} key={index} className="faq-accordion-item">
                    <Accordion.Header className="faq-accordion-header">
                      {faq.question}
                    </Accordion.Header>
                    <Accordion.Body className="faq-accordion-body">
                      {faq.answer}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default ContactPage;