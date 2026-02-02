import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Form, Spinner, Alert, Badge, Button } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { FaThLarge, FaMobileAlt, FaLaptop, FaTv, FaGamepad, FaHeadphones } from 'react-icons/fa';
import { getAllProducts } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import './ProductsPage.css';

function ProductsPage() {
  const [searchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  
  // Price range filter states
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [appliedMinPrice, setAppliedMinPrice] = useState('');
  const [appliedMaxPrice, setAppliedMaxPrice] = useState('');

  const categories = [
    { id: 'all', name: 'All Products', icon: <FaThLarge /> },
    { id: 'phone', name: 'Phones', icon: <FaMobileAlt /> },
    { id: 'laptop', name: 'Laptops', icon: <FaLaptop /> },
    { id: 'tv', name: 'TVs & Monitors', icon: <FaTv /> },
    { id: 'gaming', name: 'Gaming', icon: <FaGamepad /> },
    { id: 'audio', name: 'Audio', icon: <FaHeadphones /> }
  ];

  // Read URL parameters and set filters on page load
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');

    // Set category from URL - if no category param, reset to 'all'
    if (categoryParam) {
      setSelectedCategory(categoryParam.toLowerCase());
    } else {
      setSelectedCategory('all');
    }

    // Set search query from URL - if no search param, clear it
    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery('');
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts();
      
      if (response.success) {
        const allProducts = response.data.flatMap((categoryGroup, catIndex) => 
          categoryGroup.products.map((product, prodIndex) => ({
            ...product,
            category: categoryGroup.category,
            _id: product._id || product.id || `prod-${catIndex}-${prodIndex}`
          }))
        );
        
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      }
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters (category, search, price range)
  useEffect(() => {
    if (products.length === 0) return;

    let filtered = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => {
        const productCategory = (product.category || '').toLowerCase();
        const productName = (product.name || '').toLowerCase();
        
        if (selectedCategory === 'phone') {
          return productCategory.includes('phone') || productName.includes('iphone') || productName.includes('galaxy') || productName.includes('oneplus');
        } else if (selectedCategory === 'laptop') {
          return productCategory.includes('laptop') || productName.includes('macbook') || productName.includes('yoga') || productName.includes('laptop');
        } else if (selectedCategory === 'gaming') {
          return productCategory.includes('gaming') || productName.includes('asus rog') || productName.includes('gaming');
        }
        return productCategory.includes(selectedCategory);
      });
    }

    // Search filter (from navbar search)
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    if (appliedMinPrice !== '' || appliedMaxPrice !== '') {
      filtered = filtered.filter(product => {
        const price = product.price || 0;
        const min = appliedMinPrice !== '' ? parseFloat(appliedMinPrice) : 0;
        const max = appliedMaxPrice !== '' ? parseFloat(appliedMaxPrice) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      return 0;
    });

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, sortBy, products, appliedMinPrice, appliedMaxPrice]);

  // Handle price filter apply
  const handleApplyPriceFilter = () => {
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
  };

  // Handle price filter clear
  const handleClearPriceFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    setAppliedMinPrice('');
    setAppliedMaxPrice('');
  };

  // Get category count
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return products.length;
    
    return products.filter(product => {
      const productCategory = (product.category || '').toLowerCase();
      const productName = (product.name || '').toLowerCase();
      
      if (categoryId === 'phone') {
        return productCategory.includes('phone') || productName.includes('iphone') || productName.includes('galaxy') || productName.includes('oneplus');
      } else if (categoryId === 'laptop') {
        return productCategory.includes('laptop') || productName.includes('macbook') || productName.includes('yoga') || productName.includes('laptop');
      } else if (categoryId === 'gaming') {
        return productCategory.includes('gaming') || productName.includes('asus rog') || productName.includes('gaming');
      }
      return productCategory.includes(categoryId);
    }).length;
  };

  if (loading) {
    return (
      <Container className="text-center py-5" style={{ marginTop: '100px' }}>
        <Spinner animation="border" variant="dark" />
        <p className="mt-3 text-muted">Loading your products...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5" style={{ marginTop: '100px' }}>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className="products-page-wrapper">
      <Container>
        <Row>
          {/* Sidebar */}
          <Col lg={3} className="d-none d-lg-block">
            <div className="filters-sidebar-sticky">
              {/* Categories */}
              <div className="mb-5">
                <h6 className="filter-heading">CATEGORIES</h6>
                <ListGroup variant="flush">
                  {categories.map((cat) => (
                    <ListGroup.Item
                      key={cat.id}
                      action
                      active={selectedCategory === cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className="category-item d-flex align-items-center justify-content-between"
                    >
                      <div className="d-flex align-items-center">
                        <span className="me-3 category-icon">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </div>
                      <Badge 
                        bg={selectedCategory === cat.id ? "light" : "transparent"} 
                        text={selectedCategory === cat.id ? "dark" : "secondary"}
                        pill
                        className="fw-normal"
                      >
                        {getCategoryCount(cat.id)}
                      </Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>

              {/* Price Range - Functional */}
              <div>
                <h6 className="filter-heading">PRICE RANGE</h6>
                <p className="text-muted small mb-3">Set your budget ($)</p>
                <div className="d-flex gap-2 mb-3">
                  <Form.Control 
                    size="sm" 
                    placeholder="Min" 
                    type="number" 
                    className="price-input"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min="0"
                  />
                  <Form.Control 
                    size="sm" 
                    placeholder="Max" 
                    type="number" 
                    className="price-input"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="d-grid gap-2">
                  <button 
                    className="btn-apply-filter"
                    onClick={handleApplyPriceFilter}
                  >
                    Apply Filter
                  </button>
                  {(appliedMinPrice !== '' || appliedMaxPrice !== '') && (
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={handleClearPriceFilter}
                    >
                      Clear Price Filter
                    </Button>
                  )}
                </div>
                {/* Show active price filter */}
                {(appliedMinPrice !== '' || appliedMaxPrice !== '') && (
                  <div className="mt-2 text-center">
                    <small className="text-muted">
                      ${appliedMinPrice || '0'} - ${appliedMaxPrice || '∞'}
                    </small>
                  </div>
                )}
              </div>
            </div>
          </Col>

          {/* Main Content */}
          <Col lg={9}>
            {/* Header Bar */}
            <div className="products-header">
              <div>
                <h2 className="products-title">
                  {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className="products-subtitle">
                  Showing {filteredProducts.length} results
                </p>
              </div>
              <div className="header-controls">
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </Form.Select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <Alert variant="light" className="text-center py-5 border-0 shadow-sm">
                <h4>No products found</h4>
                <p className="text-muted mb-3">Try adjusting your filters or search criteria.</p>
                <button 
                  className="btn btn-dark"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    handleClearPriceFilter();
                  }}
                >
                  Clear All Filters
                </button>
              </Alert>
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4">
                {filteredProducts.map((product) => (
                  <Col key={product._id}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ProductsPage;