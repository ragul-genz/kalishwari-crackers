import React from 'react';
import styled from 'styled-components';
import sparklersImg from '../assets/images/sparklers.jpg';
import fountainsImg from '../assets/images/fountains.jpg';
import { Link } from 'react-router-dom';

const PageWrapper = styled.div`
  padding: 4rem 20px;
  min-height: 80vh;
  background-color: #fcfcfc;
`;

const Section = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto 5rem auto;
  gap: 3rem;

  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  width: 100%;
  
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    object-fit: cover;
  }
`;

const TextContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Heading = styled.h2`
  font-size: 2.8rem;
  color: #222;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  text-transform: uppercase;
  font-weight: 700;
  
  @media (max-width: 900px) {
    font-size: 2.2rem;
  }
`;

const SubText = styled.p`
  font-size: 1.1rem;
  color: #555;
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

const HighlightText = styled.span`
  font-weight: 700;
  color: #333;
`;

const ActionButton = styled(Link)`
  display: inline-block;
  background-color: var(--brand-red, #c62828);
  color: #fff;
  padding: 12px 30px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;
  align-self: flex-start;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(198, 40, 40, 0.3);

  &:hover {
    background-color: var(--brand-red-dark, #8e0000);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(198, 40, 40, 0.4);
    color: #fff;
  }

  @media (max-width: 900px) {
    align-self: center;
  }
`;

const About = () => {
  return (
    <PageWrapper>
      {/* First Section */}
      <Section>
        <ImageContainer>
          <img src={fountainsImg} alt="Diwali Crackers Celebration" />
        </ImageContainer>
        <TextContent>
          <Heading>CRACKERS ONLINE SHOPPING</Heading>
          <SubText>
            <HighlightText>Crackers Online Shopping</HighlightText> is increasing nowadays, and you can conveniently book Diwali crackers from the comfort of your home using your mobile phone, making your <HighlightText>online crackers shopping</HighlightText> experience hassle-free.
          </SubText>
          <SubText>
            <HighlightText>Kalishwary Crackers</HighlightText> is a leading <HighlightText>crackers online shopping in Sivakasi</HighlightText>, offering a wide range of high-quality <HighlightText>online crackers sivakasi</HighlightText> at unbeatable prices with amazing discounts. We bring you an extensive collection of fireworks sourced directly from Sivakasi's top manufacturers.
          </SubText>
          <SubText style={{ fontWeight: 600, color: '#333' }}>
            Order Now for the Ultimate Sivakasi Experience!
          </SubText>
          <ActionButton to="/shop">PRICELIST</ActionButton>
        </TextContent>
      </Section>

      {/* Second Section */}
      <Section>
        <ImageContainer>
          <img src={sparklersImg} alt="Kids enjoying sparklers" />
        </ImageContainer>
        <TextContent>
          <Heading style={{ color: 'var(--brand-red, #c62828)' }}>ONLINE CRACKERS SHOPPING SIVAKASI</Heading>
          <SubText>
            Welcome to <HighlightText>Kalishwary Crackers</HighlightText>, your premier destination for high-quality fireworks since 2020. We are a leading crackers online shopping platform located in the heart of Sivakasi, offering an extensive collection of sparklers, flower pots, rockets, fancy crackers, and multi-shot aerials.
          </SubText>
          <SubText>
            All our crackers are sourced directly from top manufacturers to ensure a smooth and enjoyable online crackers shopping experience. With our user-friendly site and fast delivery service, we strive to make your celebrations brighter and more memorable.
          </SubText>
          <ActionButton to="/shop">SHOP NOW</ActionButton>
        </TextContent>
      </Section>
    </PageWrapper>
  );
};

export default About;

