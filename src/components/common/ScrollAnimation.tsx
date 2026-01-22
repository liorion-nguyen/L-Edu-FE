import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './ScrollAnimation.css';

interface ScrollAnimationProps {
  children: React.ReactNode;
  animationType?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'zoomIn';
  delay?: number;
  duration?: number;
  className?: string;
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  animationType = 'fadeIn',
  delay = 0,
  duration = 0.8,
  className = '',
}) => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true,
  });

  return (
    <div
      ref={elementRef}
      className={`scroll-animation scroll-animation-${animationType} ${
        isVisible ? 'scroll-animation-visible' : ''
      } ${className}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollAnimation;
