import React, { useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaDownload } from 'react-icons/fa';
import './OrderSuccess.css';

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  useEffect(() => {
    // Redirect if no order data
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);

  if (!orderData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="order-success-page">
      <Container>
        <Card className="success-card">
          <Card.Body className="text-center">
            {/* Success Icon */}
            <div className="success-icon">
              <FaCheckCircle />
            </div>

            {/* Success Message */}
            <h2 className="success-title">Order Placed Successfully!</h2>
            <p className="success-subtitle">
              Thank you for your purchase, {orderData.customerName}
            </p>

            {/* Order Number */}
            <div className="order-number-box">
              <p className="order-number-label">Order Number</p>
              <h3 className="order-number">{orderData.orderNumber}</h3>
            </div>

            {/* Order Details */}
            <div className="order-details">
              <div className="detail-row">
                <span>Email:</span>
                <span>{orderData.email}</span>
              </div>
              <div className="detail-row">
                <span>Order Date:</span>
                <span>{new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="detail-row">
                <span>Total Amount:</span>
                <span className="total-amount">${(orderData.total * 1.08).toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span>Number of Items:</span>
                <span>{orderData.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
            </div>

            {/* Confirmation Message */}
            <div className="confirmation-message">
              <p>
                📧 A confirmation email has been sent to <strong>{orderData.email}</strong>
              </p>
              <p className="text-muted">
                You can track your order status in your email or contact our support team.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <Button 
                variant="dark" 
                size="lg"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </Button>
              <Button 
                variant="outline-dark" 
                size="lg"
                onClick={handlePrint}
              >
                <FaDownload className="me-2" />
                Print Receipt
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default OrderSuccess;