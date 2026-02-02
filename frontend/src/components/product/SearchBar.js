import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './SearchBar.css';

function SearchBar({ onSearch, initialValue = '' }) {
  const [searchInput, setSearchInput] = useState(initialValue);

  // Update local state when initialValue changes (from URL)
  useEffect(() => {
    setSearchInput(initialValue);
  }, [initialValue]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleClear = () => {
    setSearchInput('');
    onSearch('');
  };

  return (
    <Form onSubmit={handleSearch} className="search-bar-component">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Search products by name or description..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="search-bar-input"
        />
        {searchInput && (
          <Button 
            variant="link" 
            onClick={handleClear}
            className="search-clear-btn"
          >
            <FaTimes />
          </Button>
        )}
        <Button 
          type="submit" 
          variant="dark"
          className="search-submit-btn"
        >
          <FaSearch /> Search
        </Button>
      </InputGroup>
    </Form>
  );
}

export default SearchBar;