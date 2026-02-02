import React from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './HeroCarousel.css';

function HeroCarousel() {
  // Carousel slides data - EASY TO UPDATE!
  const slides = [
    {
      id: 1,
      title: 'New Galaxy Tab S10',
      headline: 'Ultra Performance',
      description: 'Experience the ultimate tablet with AI-powered productivity, stunning display, and all-day battery life.',
      image: '/images/hero/slide1.jpg', // ← Easy to replace!
      primaryButton: { text: 'Buy Now', link: '/products?search=galaxy' },
      secondaryButton: { text: 'Learn More', link: '/products' }
    },
    {
      id: 2,
      title: 'iPhone 16 Pro Max',
      headline: 'Titanium. So Strong. So Light.',
      description: 'Forged in titanium with advanced features including A18 Pro chip and pro camera system.',
      image: '/images/hero/slide2.jpg', // ← Easy to replace!
      primaryButton: { text: 'Buy Now', link: '/products?search=iphone' },
      secondaryButton: { text: 'Learn More', link: '/products' }
    },
    {
      id: 3,
      title: 'Samsung Galaxy S25 Ultra',
      headline: 'AI Revolution Starts Here',
      description: 'Next-gen Galaxy AI transforms your mobile experience with revolutionary features and titanium design.',
      image: '/images/hero/slide3.jpg', // ← Easy to replace!
      primaryButton: { text: 'Buy Now', link: '/products?search=samsung' },
      secondaryButton: { text: 'Learn More', link: '/products' }
    }
  ];

  return (
    <div className="hero-carousel-wrapper">
      <Carousel 
        fade 
        controls={true} 
        indicators={true}
        interval={5000}
        pause="hover"
      >
        {slides.map((slide) => (
          <Carousel.Item key={slide.id}>
            <div className="hero-slide">
              {/* Background Image */}
              <div 
                className="hero-background"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                {/* Overlay for better text readability */}
                <div className="hero-overlay"></div>
              </div>

              {/* Content */}
              <div className="hero-content">
                <div className="hero-text">
                  <p className="hero-subtitle">{slide.title}</p>
                  <h1 className="hero-headline">{slide.headline}</h1>
                  <p className="hero-description">{slide.description}</p>
                  
                  <div className="hero-buttons">
                    <Link to={slide.primaryButton.link} className="btn-hero-primary">
                      {slide.primaryButton.text}
                    </Link>
                    <Link to={slide.secondaryButton.link} className="btn-hero-secondary">
                      {slide.secondaryButton.text}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default HeroCarousel;