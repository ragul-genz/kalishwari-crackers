import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { getStoredSettings } from '../utils/settingsManager';

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
  min-width: 200px;
  
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

const FooterBottom = styled.div`
  text-align: center;
  padding: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background-color: rgba(255, 255, 255, 0.5);
  color: var(--text-muted);
  font-size: 0.8rem;
`;

const Footer = () => {
  const [storeSettings, setStoreSettings] = useState(getStoredSettings());

  useEffect(() => {
    const handleUpdate = () => setStoreSettings(getStoredSettings());
    window.addEventListener('settingsUpdated', handleUpdate);
    return () => window.removeEventListener('settingsUpdated', handleUpdate);
  }, []);

  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterSection>
          <h4>ABOUT US</h4>
          <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6'}}>
            {storeSettings.shopName} is a leading online shop in Sivakasi. We provide 100% genuine and safe fireworks for all your celebrations.
          </p>
        </FooterSection>
        
        <FooterSection>
          <h4>STORE LOCATION</h4>
          <p style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            <MapPin size={18} style={{ color: 'var(--brand-red, #c62828)', flexShrink: 0, marginTop: '3px' }} />
            <span>{storeSettings.address}</span>
          </p>
          <p style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <Phone size={16} style={{ color: 'var(--brand-red, #c62828)', flexShrink: 0 }} />
            <span>{storeSettings.phone}</span>
          </p>
          <p style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <Mail size={16} style={{ color: 'var(--brand-red, #c62828)', flexShrink: 0 }} />
            <span>{storeSettings.email}</span>
          </p>
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
      </FooterContainer>
      <FooterBottom>
        <p>&copy; {new Date().getFullYear()} {storeSettings.shopName}. All rights reserved.</p>
        <p style={{marginTop: '8px'}}>Developed by : <span style={{fontWeight: '700', color: 'var(--brand-red)'}}>GenZ Neural-X</span></p>
      </FooterBottom>
    </FooterWrapper>
  );
};

export default Footer;
