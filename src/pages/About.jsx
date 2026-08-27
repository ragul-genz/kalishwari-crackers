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
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
  color: var(--text-muted);
  font-size: 1.1rem;
`;

const About = () => {
  return (
    <PageWrapper className="container">
      <Title>About <span className="gold-text">Us</span></Title>
      <Content className="glass-card">
        <p>Welcome to <strong>Kalishwary Crackers</strong>! We are dedicated to bringing joy and light to your celebrations with our premium quality fireworks.</p>
        <p style={{marginTop: '1rem'}}>With years of experience in the industry, we ensure that our products are safe, vibrant, and exactly what you need to make your special moments unforgettable. We offer a wide range of sparklers, fountains, rockets, and custom gift boxes tailored for family events and grand celebrations.</p>
      </Content>
    </PageWrapper>
  );
};

export default About;
