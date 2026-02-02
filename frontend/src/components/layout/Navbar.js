import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext'; // ← ADD THIS
import SearchAutocomplete from '../common/SearchAutocomplete';
import './Navbar.css';

function Navbar() {
  const { getCartItemsCount } = useCart(); // ← ADD THIS
  const cartItemCount = getCartItemsCount(); // ← UPDATED: Now uses actual cart

  return (
    <BootstrapNavbar 
      bg="white"
      variant="light"
      expand="lg" 
      fixed="top"
      className="custom-navbar"
    >
      <Container>
        {/* Logo */}
        <BootstrapNavbar.Brand as={Link} to="/" className="brand-logo">
          <div className="logo-icon">V</div>
          <span className="logo-text">VisionTech</span>
        </BootstrapNavbar.Brand>
        
        {/* Mobile hamburger */}
        <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
        
        {/* Navigation Links */}
        <BootstrapNavbar.Collapse id="navbar-nav">
          <Nav className="mx-auto nav-links">
            <Nav.Link as={Link} to="/products">Store</Nav.Link>
            <Nav.Link as={Link} to="/products?category=phone">Phone</Nav.Link>
            <Nav.Link as={Link} to="/products?category=laptop">Laptop</Nav.Link>
            <Nav.Link as={Link} to="/products?category=tv">TV & Monitors</Nav.Link>
            <Nav.Link as={Link} to="/products?category=gaming">Gaming</Nav.Link>
            <Nav.Link as={Link} to="/products?category=audio">Audio</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
          </Nav>
          
          {/* ✅ UPDATED: Search with Autocomplete */}
          <SearchAutocomplete />
          
          {/* Cart Button */}
          <Link to="/cart" className="cart-button">
            <FaShoppingCart />
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </Link>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;