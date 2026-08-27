import React from 'react';
import styled from 'styled-components';

const PageWrapper = styled.div`
  padding: 4rem 20px;
  min-height: 60vh;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--text-main);
`;

const Content = styled.div`
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ContactInfo = styled.div`
  padding: 2rem;
  text-align: center;
  
  h3 {
    color: var(--gold-primary);
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
    
  p {
    margin-bottom: 0.8rem;
    color: var(--text-muted);
  }
`;

const Contact = () => {
  return (
    <PageWrapper className="container">
      <Title>Contact <span className="gold-text">Us</span></Title>
      <Content>
        <ContactInfo className="glass-card">
          <h3>Get In Touch</h3>
          <p><strong>Phone / WhatsApp:</strong> +91 98765 43210</p>
          <p><strong>Email:</strong> info@kalishwarycrackers.com</p>
          <p><strong>Address:</strong> Sivakasi, Tamil Nadu, India</p>
        </ContactInfo>
      </Content>
    </PageWrapper>
  );
};

export default Contact;
