import React from 'react';
import styled from 'styled-components';

const FloatContainer = styled.a`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background-color: #25d366;
  color: #fff;
  border-radius: 50px;
  text-align: center;
  font-size: 30px;
  box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
    color: #fff;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const FloatingWhatsApp = () => {
  return (
    <FloatContainer href="https://wa.me/916380116372" target="_blank" rel="noopener noreferrer" title="Chat on WhatsApp">
      <svg viewBox="0 0 32 32" width="35" height="35" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2a13 13 0 0 0-11 20l-2 5 5-2a13 13 0 1 0 8-23zm0 24a11 11 0 0 1-6-2l-3 1 1-3a11 11 0 1 1 8 4zm6-7c0-.2-.1-.3-.3-.4l-2-.8c-.1-.1-.3-.1-.4 0l-.8 1a.3.3 0 0 1-.3 0 7 7 0 0 1-3-3 .3.3 0 0 1 0-.3l1-.8c.1-.2.2-.4.1-.5l-1-2c-.1-.3-.3-.3-.5-.3h-.5c-.3 0-.6.1-.9.4a3 3 0 0 0-.8 2c0 1.2.6 2.3 2 4 1 2 3 4 5 4s2-.6 2-1c0-.4 0-1 0-1z" />
      </svg>
    </FloatContainer>
  );
};

export default FloatingWhatsApp;
