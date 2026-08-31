import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';
import { Fireworks } from '@fireworks-js/react';
import logoImg from '../assets/logo.jpg';

const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.section`
  position: relative;
  min-height: 550px;
  display: flex;
  align-items: center;
  background-color: #050505;
  background-image: 
    radial-gradient(circle at 100% 50%, rgba(198, 40, 40, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 0% 0%, rgba(212, 175, 55, 0.1) 0%, transparent 30%);
  overflow: hidden;
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-image: url('data:image/svg+xml;utf8,<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm0 38c-9.941 0-18-8.059-18-18S10.059 2 20 2s18 8.059 18 18-8.059 18-18 18z" fill="rgba(0,0,0,0.05)"/></svg>');
  pointer-events: none;
`;

const FireworksBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.8;
  pointer-events: none;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeroTextContainer = styled.div`
  flex: 1;
  max-width: 600px;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.2;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, var(--gold-light), var(--gold-primary), var(--gold-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 1px 1px 20px rgba(212,175,55,0.2);
  font-weight: 700;
  text-transform: uppercase;
`;

const HeroSubtitle = styled.p`
  font-size: 1rem;
  color: #e0e0e0;
  margin-bottom: 2.5rem;
  line-height: 1.8;
  font-weight: 400;
`;

const YellowButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(135deg, var(--gold-light), var(--gold-primary), var(--gold-dark));
  color: #050505;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
  }
`;

const HeroImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  
  @media (max-width: 768px) {
    justify-content: center;
    margin-top: 2rem;
  }
`;

const CrackersImageWrapper = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.3));
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    box-shadow: inset 0 0 40px 20px #000;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
    
    &::after {
      box-shadow: inset 0 0 25px 12px #000;
    }
  }
`;

const CrackersImage = styled.img`
  width: 85%;
  height: 85%;
  object-fit: contain;
`;

const FeaturesSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: -50px;
  position: relative;
  z-index: 20;
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 2.5rem 2rem;
  
  h3 {
    margin-bottom: 1rem;
    color: var(--gold-light);
  }
  
  p {
    color: var(--text-muted);
    font-size: 0.95rem;
  }
`;

const FeatureIcon = styled.div`
  color: var(--gold-primary);
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
`;

const CategoriesSection = styled.section`
  padding: 6rem 20px;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const CategoryCard = styled(Link)`
  display: block;
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: var(--transition);
  text-decoration: none;

  &:hover {
    transform: translateY(-10px);
    border-color: rgba(212, 175, 55, 0.3);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }
`;

const CategoryImagePlaceholder = styled.div`
  height: 200px;
  background: linear-gradient(180deg, rgba(26, 26, 26, 1) 0%, rgba(10, 10, 10, 1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CategoryInfo = styled.div`
  padding: 1.5rem;
  text-align: center;
  
  h3 {
    color: var(--text-light);
    margin-bottom: 0.5rem;
  }
`;

const CategoryLink = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--gold-primary);
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const CtaSection = styled.section`
  background: linear-gradient(rgba(10, 10, 10, 0.9), rgba(10, 10, 10, 0.9)), url('data:image/svg+xml;utf8,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(212,175,55,0.05)" stroke-width="1"/></svg>') center/cover;
  padding: 6rem 20px;
  text-align: center;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
`;

const CtaContent = styled.div`
  h2 {
    font-size: 2.5rem;
    color: var(--gold-light);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--text-muted);
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const Home = () => {
  return (
    <HomeWrapper>
      <HeroSection>
        <FireworksBackground>
          <Fireworks
            options={{
              rocketsPoint: { min: 0, max: 100 },
              hue: { min: 0, max: 360 },
              delay: { min: 15, max: 30 },
              speed: 2,
              acceleration: 1.05,
              friction: 0.95,
              gravity: 1.5,
              particles: 50,
              trace: 3,
              explosion: 5,
              intensity: 30,
              flickering: 50,
              lineStyle: 'round',
              lineWidth: { explosion: { min: 1, max: 3 }, trace: { min: 1, max: 2 } },
              brightness: { min: 50, max: 80 },
              decay: { min: 0.015, max: 0.03 }
            }}
            style={{
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              position: 'absolute'
            }}
          />
        </FireworksBackground>
        <HeroOverlay />
        <HeroContent className="container">
          <HeroTextContainer>
            <HeroTitle>
              ONLINE CRACKERS IN SIVAKASI
            </HeroTitle>
            <HeroSubtitle>
              <span style={{color: 'var(--gold-primary)', fontWeight: 'bold'}}>Kalishwary Crackers</span> is a leading Online Crackers shop in Sivakasi. We are top Online Crackers in Sivakasi for more than 25 years of experience in Online crackers in sivakasi. With our Top-Rated Customer service, good packaging and proper delivery of online crackers we now have more than 25,000+ happy customers.
            </HeroSubtitle>
            <YellowButton to="/about">
              KNOW MORE ABOUT US
            </YellowButton>
          </HeroTextContainer>
          <HeroImageContainer>
            <CrackersImageWrapper>
              <CrackersImage src={logoImg} alt="Kalishwary Crackers Logo" />
            </CrackersImageWrapper>
          </HeroImageContainer>
        </HeroContent>
      </HeroSection>

      <FeaturesSection className="container">
        <FeatureCard>
          <FeatureIcon>
            <ShieldCheck size={40} />
          </FeatureIcon>
          <h3>100% Genuine</h3>
          <p>We provide authentic Sivakasi crackers directly from manufacturers.</p>
        </FeatureCard>
        <FeatureCard>
          <FeatureIcon>
            <Truck size={40} />
          </FeatureIcon>
          <h3>Safe Delivery</h3>
          <p>Carefully packed and safely delivered to your doorstep.</p>
        </FeatureCard>
        <FeatureCard>
          <FeatureIcon>
            <Clock size={40} />
          </FeatureIcon>
          <h3>Fast Delivery</h3>
          <p>On time delivery to make your celebrations brighter.</p>
        </FeatureCard>
      </FeaturesSection>

      <CategoriesSection id="categories" className="container">
        <SectionTitle>Shop by <span className="gold-text">Category</span></SectionTitle>
        <CategoriesGrid>
          {['Sparklers', 'Fountains', 'Rockets', 'Night Sky', 'Gift Boxes', 'Bomb'].map((category, index) => (
            <CategoryCard to="/shop" key={index}>
              <CategoryImagePlaceholder>
                <Sparkles className="gold-text" size={48} />
              </CategoryImagePlaceholder>
              <CategoryInfo>
                <h3>{category}</h3>
                <CategoryLink>View Products <ArrowRight size={14} /></CategoryLink>
              </CategoryInfo>
            </CategoryCard>
          ))}
        </CategoriesGrid>
      </CategoriesSection>

      <CtaSection>
        <CtaContent className="container">
          <h2>Ready for a spectacular night?</h2>
          <p>Browse our extensive collection of fireworks and make your events memorable.</p>
          <Link to="/shop" className="btn-primary">
            View Price List
          </Link>
        </CtaContent>
      </CtaSection>
    </HomeWrapper>
  );
};

export default Home;
