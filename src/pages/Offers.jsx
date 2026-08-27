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

const OffersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const OfferCard = styled.div`
  padding: 2.5rem 2rem;
  text-align: center;
  border: 1px solid var(--gold-primary);
  border-radius: 12px;
  background: rgba(212, 175, 55, 0.05);
  transition: var(--transition);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(212, 175, 55, 0.1);
  }
  
  h3 {
    font-size: 1.5rem;
    color: var(--brand-red);
    margin-bottom: 1rem;
  }
  
  .discount {
    font-size: 3rem;
    font-weight: bold;
    color: var(--gold-primary);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--text-muted);
  }
`;

const Offers = () => {
  return (
    <PageWrapper className="container">
      <Title>Special <span className="gold-text">Offers</span></Title>
      <OffersGrid>
        <OfferCard className="glass-card">
          <h3>Diwali Mega Combo</h3>
          <div className="discount">30% OFF</div>
          <p>Get a flat 30% discount on all family combo boxes this festival season.</p>
        </OfferCard>
        <OfferCard className="glass-card">
          <h3>Early Bird Sale</h3>
          <div className="discount">15% OFF</div>
          <p>Order 30 days before the festival and get 15% off on your entire cart.</p>
        </OfferCard>
      </OffersGrid>
    </PageWrapper>
  );
};

export default Offers;
