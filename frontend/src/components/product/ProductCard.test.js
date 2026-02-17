import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../../context/CartContext';
import ProductCard from './ProductCard';

const mockProduct = {
  _id: 'phone-0',
  name: 'iPhone 16 Pro Max',
  price: 1199,
  category: 'phone',
  image: 'iphone-16-pro.jpg'
};

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <CartProvider>
        {component}
      </CartProvider>
    </BrowserRouter>
  );
};

describe('ProductCard', () => {
  test('renders product information', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('iPhone 16 Pro Max')).toBeInTheDocument();
    expect(screen.getByText('$1,199.00')).toBeInTheDocument();
  });

  test('displays product image', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const image = screen.getByAltText('iPhone 16 Pro Max');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/products/iphone-16-pro.jpg');
  });
});