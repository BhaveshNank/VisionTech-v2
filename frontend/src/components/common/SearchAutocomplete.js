import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, Button, ListGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { getAllProducts } from '../../services/api';
// ❌ REMOVED: import './SearchAutocomplete.css';

function SearchAutocomplete() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [allProducts, setAllProducts] = useState([]);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await getAllProducts();
      if (response.success) {
        const products = response.data.flatMap((categoryGroup) =>
          categoryGroup.products.map((product) => ({
            ...product,
            category: categoryGroup.category,
            _id: product._id || product.id
          }))
        );
        setAllProducts(products);
      }
    } catch (err) {
      console.error('Error fetching products for autocomplete:', err);
    }
  };

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        filterProducts(searchQuery);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayTimer);
  }, [searchQuery, allProducts]);

  const filterProducts = (query) => {
    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(query.toLowerCase())) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6);

    setSuggestions(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/products/${productId}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < suggestions.length ? prev + 1 : prev);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > -1 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]._id);
        } else if (selectedIndex === suggestions.length) {
          handleSearch(e);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Form className="d-flex search-form" onSubmit={handleSearch} ref={searchRef}>
      <div className="search-container" style={{ position: 'relative' }}>
        <FormControl
          ref={inputRef}
          type="search"
          placeholder="Search products..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <Button variant="link" type="submit" className="search-button">
          <FaSearch />
        </Button>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {suggestions.length > 0 ? (
              <ListGroup variant="flush">
                {suggestions.map((product, index) => (
                  <ListGroup.Item
                    key={product._id}
                    action
                    active={selectedIndex === index}
                    onClick={() => handleSuggestionClick(product._id)}
                    style={{
                      border: 'none',
                      padding: '12px 16px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={product.image ? `/images/products/${product.image}` : '/images/placeholder-product.png'}
                        alt={product.name}
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'contain',
                          borderRadius: '8px',
                          backgroundColor: '#f8f9fa',
                          padding: '4px'
                        }}
                        onError={(e) => {
                          e.target.src = '/images/placeholder-product.png';
                        }}
                      />
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          color: '#000',
                          marginBottom: '4px'
                        }}>
                          {product.name}
                        </div>
                        <div style={{
                          fontSize: '0.8rem',
                          color: '#666',
                          textTransform: 'capitalize'
                        }}>
                          {product.category}
                        </div>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}

                {/* "View all results" option */}
                <ListGroup.Item
                  action
                  active={selectedIndex === suggestions.length}
                  onClick={handleSearch}
                  style={{
                    border: 'none',
                    borderTop: '1px solid #e0e0e0',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <FaSearch className="me-2" />
                  View all results for "{searchQuery}"
                </ListGroup.Item>
              </ListGroup>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center' }}>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                  No products found for "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Form>
  );
}

export default SearchAutocomplete;