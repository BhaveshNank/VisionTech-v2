import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { getAllProducts } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import HeroCarousel from '../components/home/HeroCarousel'; // ← Import
import FeaturedProducts from '../components/home/FeaturedProducts';
import DealsSection from '../components/home/DealsSection';
import ExperienceSection from '../components/home/ExperienceSection';
import GamingSection from '../components/home/GamingSection';
import TestimonialsSection from '../components/home/TestimonialsSection';


function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await getAllProducts();
      if (response.success) {
        const allProducts = response.data.flatMap(category => category.products);
        // Get first 3 products as featured
        setFeaturedProducts(allProducts.slice(0, 3));
      }
    } catch (err) {
      console.error('Error fetching featured products:', err);
    }
  };

  return (
    <div>

      <HeroCarousel/>

      <FeaturedProducts/>

      <DealsSection/>

      <ExperienceSection/>

      <GamingSection/>

      <TestimonialsSection/>


    </div>
  );
}

export default HomePage;