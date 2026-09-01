import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollBtn = styled(motion.button)`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: var(--brand-red);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  border: none;
  cursor: pointer;
  
  @media (max-width: 768px) {
    bottom: 90px;
    right: 15px;
    width: 40px;
    height: 40px;
  }
`;

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <ScrollBtn
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
        >
          <ArrowUp size={24} />
        </ScrollBtn>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
