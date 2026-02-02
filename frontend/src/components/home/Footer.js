import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import './Footer.css';

function Footer() {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        // TODO: Add newsletter subscription logic here
        console.log('Subscribing email:', email);
        alert(`Thank you for subscribing with ${email}!`);
        setEmail('');
    };

    return (
        <footer className="footer">
            {/* Main Footer Content */}
            <Container className="footer-content">
                <Row>
                    {/* Column 1: VisionTech Brand */}
                    <Col lg={3} md={6} className="footer-col">
                        <div className="footer-brand">
                            <h3 className="footer-logo">VisionTech</h3>
                            <div className="footer-logo-underline"></div>
                            <p className="footer-description">
                                Your trusted partner for quality electronics. We provide expert recommendations
                                powered by AI to help you find the perfect tech products.
                            </p>
                            <p className="footer-creator">Created by Bhavesh Nankani</p>

                            {/* Social Icons */}
                            <div className="social-icons">
                                <a href="mailto:contact@visiontech.com" className="social-icon" aria-label="Email">
                                    <FaEnvelope />
                                </a>
                                <a href="https://twitter.com/visiontech" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
                                    <FaXTwitter />
                                </a>
                                <a href="https://github.com/visiontech" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
                                    <FaGithub />
                                </a>
                                <a href="https://linkedin.com/company/visiontech" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                                    <FaLinkedin />
                                </a>
                            </div>
                        </div>
                    </Col>

                    {/* Column 2: Shop Links Example */}
                    <Col lg={3} md={6} className="footer-col">
                        <div className="footer-section">
                            <div className="title-block"> {/* Wrap for better control if needed */}
                                <h4 className="footer-heading">Shop</h4>
                                <div className="footer-heading-underline"></div>
                            </div>
                            <ul className="footer-links">
                                <li><Link to="/products">Categories</Link></li>
                                {/* ... rest of links */}
                            </ul>
                        </div>
                    </Col>

                    {/* Column 3: Support Links */}
                    <Col lg={3} md={6} className="footer-col">
                        <div className="footer-section">
                            <h4 className="footer-heading">Support</h4>
                            <div className="footer-heading-underline"></div>
                            <ul className="footer-links">
                                <li><Link to="/contact">Contact Us</Link></li>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/faq">FAQ</Link></li>
                                <li><Link to="/shipping">Shipping Info</Link></li>
                            </ul>
                        </div>
                    </Col>

                    {/* Column 4: Newsletter Subscription */}
                    <Col lg={3} md={6} className="footer-col">
                        <div className="footer-section">
                            <h4 className="footer-heading">Stay Updated</h4>
                            <div className="footer-heading-underline"></div>
                            <p className="newsletter-description">
                                Subscribe to get the latest products, deals and tech news.
                            </p>

                            {/* Newsletter Form */}
                            <Form onSubmit={handleSubscribe} className="newsletter-form">
                                <Form.Group className="newsletter-group">
                                    <Form.Control
                                        type="email"
                                        placeholder="Your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="newsletter-input"
                                    />
                                    <Button type="submit" className="newsletter-button">
                                        Subscribe
                                    </Button>
                                </Form.Group>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Footer Bottom Bar */}
            <div className="footer-bottom">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6} className="text-center text-md-start">
                            <p className="footer-copyright">
                                © 2026 VisionTech. All rights reserved.
                            </p>
                        </Col>
                        <Col md={6} className="text-center text-md-end">
                            <div className="footer-legal-links">
                                <Link to="/privacy">Privacy Policy</Link>
                                <span className="separator">|</span>
                                <Link to="/terms">Terms of Service</Link>
                                <span className="separator">|</span>
                                <Link to="/returns">Return Policy</Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </footer>
    );
}

export default Footer;