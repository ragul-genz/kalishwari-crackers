import React from 'react';
import styled from 'styled-components';
import { MapPin, PhoneCall, Mail, Clock } from 'lucide-react';
import bannerBg from '../assets/images/rockets.jpg';

const PageWrapper = styled.div`
  min-height: 80vh;
  background-color: #ffffff;
`;

const TopBanner = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bannerBg});
  background-size: cover;
  background-position: center;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;

  h1 {
    font-size: 3rem;
    margin-bottom: 10px;
    font-weight: 700;
  }

  p {
    font-size: 1.1rem;
    color: #ddd;
    
    span {
      color: var(--brand-red, #c62828);
    }
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 3rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div``;

const FormTitle = styled.h2`
  color: var(--brand-red, #c62828);
  font-size: 2.2rem;
  margin-bottom: 1rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const FormDescription = styled.p`
  color: #555;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ContactForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
  }

  input, textarea {
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
    font-size: 1rem;
    background-color: #fafafa;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: var(--brand-red, #c62828);
      background-color: #fff;
    }
  }

  &.full-width {
    grid-column: 1 / -1;
  }
`;

const SubmitButton = styled.button`
  grid-column: 1 / -1;
  background-color: var(--brand-red, #c62828);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  justify-self: start;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--brand-red-dark, #8e0000);
  }
`;

const RightColumn = styled.div``;

const InfoBox = styled.div`
  background-color: #fff9f9;
  border-radius: 8px;
  padding: 2.5rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
`;

const InfoBoxTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--brand-red, #c62828);
  display: inline-block;
  text-transform: uppercase;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 15px;

  .icon-circle {
    color: var(--brand-red, #c62828);
    margin-top: 3px;
  }

  .details {
    h4 {
      font-size: 1.05rem;
      color: #222;
      margin-bottom: 5px;
      font-weight: 600;
    }
    p {
      color: #666;
      line-height: 1.5;
      font-size: 0.95rem;
    }
    a {
      color: var(--brand-red, #c62828);
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 450px;
  margin-top: 2rem;

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const Contact = () => {
  return (
    <PageWrapper>
      <TopBanner>
        <h1>CONTACT US</h1>
        <p>Home / <span>Contact</span></p>
      </TopBanner>

      <ContentContainer>
        <LeftColumn>
          <FormTitle>LET'S GET IN TOUCH!</FormTitle>
          <FormDescription>
            You can contact us any way that is convenient for you. We are available 24/7 via phone or email. You can also use a quick contact form below or visit our office personally. We would be happy to answer your questions.
          </FormDescription>

          <ContactForm onSubmit={(e) => e.preventDefault()}>
            <FormGroup>
              <label>Name</label>
              <input type="text" placeholder="Your Name" />
            </FormGroup>
            <FormGroup>
              <label>Email</label>
              <input type="email" placeholder="Your Email" />
            </FormGroup>
            <FormGroup>
              <label>Phone</label>
              <input type="tel" placeholder="Phone Number" />
            </FormGroup>
            <FormGroup>
              <label>Subject</label>
              <input type="text" placeholder="Subject" />
            </FormGroup>
            <FormGroup className="full-width">
              <label>Message</label>
              <textarea rows="5" placeholder="Your Message"></textarea>
            </FormGroup>
            <SubmitButton type="submit">SEND MESSAGE</SubmitButton>
          </ContactForm>
        </LeftColumn>

        <RightColumn>
          <InfoBox>
            <InfoBoxTitle>STORE INFORMATION</InfoBoxTitle>
            
            <InfoItem>
              <div className="icon-circle">
                <MapPin size={24} />
              </div>
              <div className="details">
                <h4>Address :</h4>
                <p>KONAMPATTI NEAR BY SRI SANKARI MAHAL, SATTUR ROAD, SIVAKASI - 626 123</p>
              </div>
            </InfoItem>

            <InfoItem>
              <div className="icon-circle">
                <PhoneCall size={24} />
              </div>
              <div className="details">
                <h4>Customer Service Number :</h4>
                <p>+91 9384053616</p>
              </div>
            </InfoItem>

            <InfoItem>
              <div className="icon-circle">
                <Mail size={24} />
              </div>
              <div className="details">
                <h4>Mail :</h4>
                <p><a href="mailto:akcrackers2.0@gmail.com">akcrackers2.0@gmail.com</a></p>
              </div>
            </InfoItem>

            <InfoItem>
              <div className="icon-circle">
                <Clock size={24} />
              </div>
              <div className="details">
                <h4>Opening Hours :</h4>
                <p>Monday to Sunday: 9:00 AM - 9:00 PM</p>
              </div>
            </InfoItem>
          </InfoBox>
        </RightColumn>
      </ContentContainer>

      <MapContainer>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15738.932822453472!2d77.78850685!3d9.4447385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cee43b8110b9%3A0x6b4a69d2d0b556f8!2sSivakasi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1689255673892!5m2!1sen!2sin" 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Store Location Map"
        ></iframe>
      </MapContainer>
    </PageWrapper>
  );
};

export default Contact;
