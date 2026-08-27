import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterWrapper = styled.footer`
  background-color: var(--bg-dark);
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  padding: 4rem 0 0 0;
  margin-top: auto;
  color: var(--text-main);
  font-family: var(--font-sans);
`;

const FooterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px 40px 40px;
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 150px;
  
  h4 {
    margin-bottom: 1.5rem;
    color: var(--text-main);
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    font-family: var(--font-sans);
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    margin-bottom: 0.8rem;
  }
  
    a, p {
    color: var(--text-muted);
    font-size: 0.9rem;
    transition: var(--transition);
    text-decoration: none;
    
    &:hover {
      color: var(--gold-primary);
    }
  }
`;

const NewsletterForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 1rem;
  
    input {
    padding: 12px 15px;
    background-color: transparent;
    border: 1px solid rgba(212, 175, 55, 0.3);
    border-radius: 25px;
    color: var(--text-main);
    font-size: 0.9rem;
    outline: none;
    
    &::placeholder {
      color: #90a4ae;
    }
    
    &:focus {
      border-color: var(--gold-primary);
    }
  }
`;

const FooterTagline = styled.p`
  font-size: 0.85rem !important;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--gold-primary) !important;
  margin-bottom: 1rem !important;
`;

const FooterBottom = styled.div`
  text-align: center;
  padding: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background-color: rgba(255, 255, 255, 0.5);
  color: var(--text-muted);
  font-size: 0.8rem;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterSection>
          <h4>DEMO PRODUCT 2</h4>
          <ul>
            <li><a href="#">product 1</a></li>
            <li><a href="#">product 2</a></li>
          </ul>
        </FooterSection>
        
        <FooterSection>
          <h4>DEMO PRODUCT 1</h4>
          <ul>
            <li><a href="#">Product 1</a></li>
            <li><a href="#">product 2</a></li>
          </ul>
        </FooterSection>
        
        <FooterSection>
          <h4>DEMO PRODUCT 3</h4>
          <ul>
            <li><a href="#">Product 1</a></li>
            <li><a href="#">Product 2</a></li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h4>USEFUL LINKS</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </FooterSection>
        
        <FooterSection style={{flex: 1.5}}>
          <h4>JOIN OUR<br/>NEWSLETTER!</h4>
          <p style={{fontSize: '0.85rem', marginBottom: '1rem', lineHeight: '1.4'}}>
            Will be used in accordance with our<br/><a href="#" style={{color: 'var(--brand-red)'}}>Privacy Policy</a>
          </p>
          <NewsletterForm>
            <input type="email" placeholder="Your email address" />
          </NewsletterForm>
        </FooterSection>
      </FooterContainer>
    </FooterWrapper>
  );
};

export default Footer;
