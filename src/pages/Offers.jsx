import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Calendar, Copy, Check, Sparkles, Gift } from 'lucide-react';
import toast from 'react-hot-toast';
import { getStoredOffers, getOffersAsync } from '../utils/offerManager';

const PageWrapper = styled.div`
  padding: 3rem 20px 5rem 20px;
  min-height: 75vh;
  background-color: var(--bg-main, #ffffff);
`;

const HeroBanner = styled.div`
  text-align: center;
  margin-bottom: 3.5rem;

  h1 {
    font-size: 2.6rem;
    color: var(--text-main);
    margin-bottom: 0.75rem;
    font-family: var(--font-serif, 'Cinzel', serif);

    @media (max-width: 600px) {
      font-size: 1.8rem;
    }
  }

  p {
    color: var(--text-muted);
    font-size: 1.05rem;
    max-width: 600px;
    margin: 0 auto;

    @media (max-width: 600px) {
      font-size: 0.9rem;
    }
  }
`;

const OffersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const OfferCard = styled(motion.div)`
  background: var(--bg-card, #f9f9f9);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(212, 175, 55, 0.2);
    border-color: var(--gold-primary, #D4AF37);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 200px;
  width: 100%;
  overflow: hidden;
  background: #111;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  ${OfferCard}:hover img {
    transform: scale(1.05);
  }

  .discount-tag {
    position: absolute;
    top: 14px;
    left: 14px;
    background: linear-gradient(135deg, var(--brand-red, #c62828), #b71c1c);
    color: #ffffff;
    font-weight: 800;
    font-size: 0.85rem;
    padding: 6px 14px;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .status-tag {
    position: absolute;
    top: 14px;
    right: 14px;
    font-weight: 700;
    font-size: 0.78rem;
    padding: 5px 12px;
    border-radius: 12px;
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    letter-spacing: 0.5px;
    text-transform: uppercase;
    z-index: 5;

    &.Active {
      background: rgba(46, 125, 50, 0.9);
      color: #ffffff;
    }
    &.Draft {
      background: rgba(230, 81, 0, 0.9);
      color: #ffffff;
    }
    &.Expired {
      background: rgba(117, 117, 117, 0.9);
      color: #ffffff;
    }
  }

  .expiry-tag {
    position: absolute;
    bottom: 12px;
    right: 14px;
    background: rgba(0, 0, 0, 0.7);
    color: #ffffff;
    font-size: 0.75rem;
    padding: 4px 10px;
    border-radius: 12px;
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;

  h3 {
    font-size: 1.3rem;
    color: var(--brand-red, #c62828);
    margin-bottom: 0.5rem;
    font-family: var(--font-serif, 'Cinzel', serif);
  }

  p {
    color: var(--text-muted);
    font-size: 0.92rem;
    line-height: 1.5;
    margin-bottom: 1.25rem;
    flex: 1;
  }
`;

const CodeContainer = styled.div`
  background: rgba(212, 175, 55, 0.08);
  border: 1.5px dashed var(--gold-primary, #D4AF37);
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .code-text {
    font-family: monospace;
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text-main);
    letter-spacing: 1.5px;
  }

  button {
    background: var(--gold-primary, #D4AF37);
    color: #ffffff;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;

    &:hover {
      background: var(--gold-dark, #AA8222);
      transform: scale(1.02);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px dashed var(--gold-primary);
  max-width: 600px;
  margin: 0 auto;

  h3 {
    color: var(--text-main);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-muted);
  }
`;

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  const loadOffers = async () => {
    const list = await getOffersAsync();
    if (list) setOffers(list);
  };

  useEffect(() => {
    loadOffers();

    const handleOffersUpdate = () => {
      loadOffers();
    };

    window.addEventListener('offersUpdated', handleOffersUpdate);
    window.addEventListener('storage', handleOffersUpdate);
    window.addEventListener('focus', handleOffersUpdate);
    document.addEventListener('visibilitychange', handleOffersUpdate);

    return () => {
      window.removeEventListener('offersUpdated', handleOffersUpdate);
      window.removeEventListener('storage', handleOffersUpdate);
      window.removeEventListener('focus', handleOffersUpdate);
      document.removeEventListener('visibilitychange', handleOffersUpdate);
    };
  }, []);

  const handleCopyCode = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success(`Coupon "${code}" copied to clipboard!`, {
      style: {
        borderRadius: '8px',
        background: '#333',
        color: '#fff',
      },
    });

    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  return (
    <PageWrapper className="container">
      <HeroBanner>
        <h1>
          Exclusive <span className="gold-text">Festival Offers</span> & Coupons
        </h1>
        <p>
          Celebrate Diwali with massive savings on premium Sivakasi crackers! Copy coupon codes below and apply during checkout.
        </p>
      </HeroBanner>

      {offers.length === 0 ? (
        <EmptyState>
          <Gift size={48} />
          <h3>No Active Offers Right Now</h3>
          <p>Check back soon for upcoming grand festival sale discounts & combos!</p>
        </EmptyState>
      ) : (
        <OffersGrid>
          {offers.map((offer) => {
            const status = offer.status || 'Active';
            const isExpired = status === 'Expired';
            const isDraft = status === 'Draft';

            return (
              <OfferCard
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ opacity: isExpired ? 0.75 : 1 }}
              >
                <ImageContainer style={{ filter: isExpired ? 'grayscale(0.4)' : 'none' }}>
                  <img src={offer.image} alt={offer.title} />
                  <span className="discount-tag">{offer.discount}</span>
                  <span className={`status-tag ${status}`}>{status}</span>
                  {offer.validUntil && (
                    <span className="expiry-tag">
                      <Calendar size={12} /> Valid till {offer.validUntil}
                    </span>
                  )}
                </ImageContainer>

                <CardContent>
                  <h3>{offer.title}</h3>
                  <p>{offer.description}</p>

                  {offer.couponCode ? (
                    <CodeContainer>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                          PROMO CODE
                        </span>
                        <span className="code-text" style={{ textDecoration: isExpired ? 'line-through' : 'none' }}>
                          {offer.couponCode}
                        </span>
                      </div>

                      <button 
                        disabled={isExpired || isDraft}
                        onClick={() => handleCopyCode(offer.id, offer.couponCode)}
                        style={{
                          opacity: (isExpired || isDraft) ? 0.6 : 1,
                          cursor: (isExpired || isDraft) ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {copiedId === offer.id ? (
                          <>
                            <Check size={14} /> Copied
                          </>
                        ) : isExpired ? (
                          'Expired'
                        ) : isDraft ? (
                          'Upcoming'
                        ) : (
                          <>
                            <Copy size={14} /> Copy Code
                          </>
                        )}
                      </button>
                    </CodeContainer>
                  ) : (
                    <CodeContainer style={{ justifyContent: 'center', background: isExpired ? '#f1f3f5' : 'rgba(46, 125, 50, 0.08)', borderColor: isExpired ? '#ced4da' : '#2e7d32' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isExpired ? '#868e96' : '#2e7d32', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={16} /> {isExpired ? 'Offer Expired' : isDraft ? 'Upcoming Offer' : 'Direct Discount - No Coupon Code Required'}
                      </span>
                    </CodeContainer>
                  )}
                </CardContent>
              </OfferCard>
            );
          })}
        </OffersGrid>
      )}
    </PageWrapper>
  );
};

export default Offers;
