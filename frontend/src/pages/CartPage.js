import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { FaTrash, FaShoppingCart, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './CartPage.css';


function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
    const navigate = useNavigate();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const handleQuantityChange = (productId, newQuantity) => {
        const quantity = parseInt(newQuantity);
        if (quantity > 0 && quantity <= 99) {
            updateQuantity(productId, quantity);
        }
    };

    if (cartItems.length === 0) {
        return (
            <Container className="cart-page d-flex align-items-center justify-content-center">
                <Card className="text-center p-5 shadow-sm border-0" style={{ borderRadius: '20px', maxWidth: '500px' }}>
                    <Card.Body>
                        <div className="mb-4">
                            <FaShoppingCart size={60} style={{ color: '#e5e7eb' }} />
                        </div>
                        <h2 className="fw-bold mb-3">Your cart is empty</h2>
                        <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/products" className="btn btn-dark btn-lg px-5">
                            Start Shopping
                        </Link>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <div className="cart-page">
            <Container className="py-5">
                <h2 className="fw-bold mb-4" style={{ letterSpacing: '-1px' }}>Shopping Cart</h2>
                <Row>
                    {/* Cart Items */}
                    <Col lg={8} className="mb-4">
                        <Card className="cart-card">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold">
                                    {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                                </span>
                                <Button variant="link" size="sm" className="text-muted text-decoration-none p-0" onClick={clearCart}>
                                    Clear all
                                </Button>
                            </Card.Header>

                            <Card.Body className="p-0">
                                <Table responsive className="align-middle">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th className="text-center">Price</th>
                                            <th className="text-center">Quantity</th>
                                            <th className="text-center">Total</th>
                                            <th className="text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item) => (
                                            <tr key={item._id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src={`/images/products/${item.image}`}
                                                            alt={item.name}
                                                            className="cart-item-image me-3"
                                                            onError={(e) => e.target.src = '/images/placeholder-product.png'}
                                                        />
                                                        <div>
                                                            {/* Added text-decoration-none to remove underline */}
                                                            <Link to={`/products/${item._id}`} className="cart-item-name text-decoration-none">
                                                                {item.name}
                                                            </Link>
                                                            {/* Brand name div removed from here */}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <span className="fw-bold">{formatPrice(item.price)}</span>
                                                </td>
                                                <td className="text-center">
                                                    <input
                                                        type="number"
                                                        className="form-control quantity-input mx-auto"
                                                        value={item.quantity}
                                                        onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                                                        min="1"
                                                        max="99"
                                                    />
                                                </td>
                                                <td className="text-center">
                                                    <span className="fw-bold text-dark">{formatPrice(item.price * item.quantity)}</span>
                                                </td>
                                                <td className="text-center">
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => removeFromCart(item._id)}
                                                    >
                                                        <FaTrash size={14} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>

                        <Link to="/products" className="btn btn-outline-dark mt-4 d-inline-flex align-items-center">
                            <FaArrowLeft className="me-2" size={12} />
                            Back to Store
                        </Link>
                    </Col>

                    {/* Order Summary */}
                    <Col lg={4}>
                        <Card className="summary-card">
                            <Card.Header>
                                <h5 className="mb-0">Summary</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="d-flex justify-content-between mb-3 text-muted">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(getCartTotal())}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3 text-muted">
                                    <span>Estimated Shipping</span>
                                    <span className="text-success fw-bold">Free</span>
                                </div>
                                <div className="d-flex justify-content-between mb-4 text-muted">
                                    <span>Tax (8%)</span>
                                    <span>{formatPrice(getCartTotal() * 0.08)}</span>
                                </div>

                                <div className="d-flex justify-content-between summary-total">
                                    <span>Total</span>
                                    <span>{formatPrice(getCartTotal() * 1.08)}</span>
                                </div>

                                <Button
                                    variant="dark"
                                    size="lg"
                                    className="w-100 mt-4 py-3 shadow-sm"
                                    onClick={() => navigate('/checkout')}
                                >
                                    Checkout Now
                                </Button>

                                <div className="text-center mt-4 pt-3 border-top">
                                    <p className="small text-muted mb-0 d-flex align-items-center justify-content-center">
                                        <FaCheckCircle className="text-success me-2" />
                                        Secure checkout and free returns
                                    </p>
                                </div>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}


export default CartPage;