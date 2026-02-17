import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';

describe('CartContext', () => {
  const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

  test('adds item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const testProduct = {
      _id: 'phone-0',
      name: 'iPhone 16 Pro Max',
      price: 1199
    };

    act(() => {
      result.current.addToCart(testProduct);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0]._id).toBe('phone-0');
  });

  test('removes item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const testProduct = {
      _id: 'phone-0',
      name: 'iPhone 16 Pro Max',
      price: 1199
    };

    act(() => {
      result.current.addToCart(testProduct);
    });

    act(() => {
      result.current.removeFromCart('phone-0');
    });

    expect(result.current.cartItems).toHaveLength(0);
  });
});