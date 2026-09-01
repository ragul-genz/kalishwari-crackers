import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, CheckCircle, FileText, Gift, MapPin, Phone, MessageCircle, Heart, Star } from 'lucide-react';
import styled from 'styled-components';
import sparklersImg from '../assets/images/sparklers.jpg';
import fountainsImg from '../assets/images/fountains.jpg';
import rocketsImg from '../assets/images/rockets.jpg';
import CheckoutModal from '../components/CheckoutModal';
import { motion } from 'framer-motion';

const ShopWrapper = styled.div`
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 120px;
`;

const TopBanner = styled.div`
  background-color: var(--brand-red-dark);
  height: 200px;
  background-image: 
    radial-gradient(circle at 100% 50%, rgba(212, 175, 55, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 0% 0%, rgba(212, 175, 55, 0.2) 0%, transparent 30%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Breadcrumbs = styled.div`
  font-size: 0.9rem;
  color: var(--text-muted);
  span {
    color: var(--text-main);
    font-weight: 600;
  }
`;

const FilterSelect = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #ddd;
  font-size: 0.9rem;
  cursor: pointer;
`;

const SelectBox = styled.select`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #ddd;
  background: white;
  outline: none;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 5px 15px;
  min-width: 250px;
  
  input {
    border: none;
    outline: none;
    margin-left: 10px;
    width: 100%;
    font-size: 0.9rem;
  }
`;

const PillsContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 5px;
  max-width: 100%;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 4px;
  }
`;

const Pill = styled.button`
  padding: 8px 20px;
  border-radius: 20px;
  white-space: nowrap;
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid ${props => props.$active ? '#2ecc71' : '#ddd'};
  background: ${props => props.$active ? '#2ecc71' : 'white'};
  color: ${props => props.$active ? 'white' : '#555'};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$active ? '#27ae60' : '#f5f5f5'};
  }
`;

const CategorySection = styled.div`
  margin-bottom: 3rem;
`;

const CategoryHeader = styled.div`
  background-color: #d32f2f;
  color: white;
  padding: 12px 20px;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  border-radius: 4px;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
`;

const ProductCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;

  &:hover {
    box-shadow: 0 8px 25px rgba(0,0,0,0.08);
    transform: translateY(-5px);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 240px;
  background-color: #f9f9f9;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    mix-blend-mode: multiply;
  }
`;

const WishlistBtn = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  color: #888;
  z-index: 10;
  transition: all 0.2s;
  
  &:hover {
    color: #e74c3c;
    transform: scale(1.1);
  }
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: #d32f2f;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  z-index: 10;
`;

const ProductDetails = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const TitlePriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 10px;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  line-height: 1.3;
  flex: 1;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const CurrentPrice = styled.span`
  font-weight: 700;
  font-size: 1.15rem;
  color: #222;
`;

const RegularPrice = styled.span`
  color: #999;
  text-decoration: line-through;
  font-size: 0.85rem;
`;

const ProductDesc = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.4;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
`;

const ReviewCount = styled.span`
  font-size: 0.8rem;
  color: #888;
  margin-left: 4px;
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: auto;
`;

const QtyControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 20px;
  overflow: hidden;

  button {
    padding: 6px 12px;
    background: transparent;
    font-weight: bold;
    color: #222;
    &:hover { background: #f5f5f5; }
  }

  input {
    width: 40px;
    text-align: center;
    border: none;
    font-weight: 600;
    font-size: 0.95rem;
    outline: none;
    background: transparent;
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

const OrderBtn = styled.button`
  background-color: transparent;
  color: #222;
  border: 1px solid #222;
  padding: 8px 24px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background-color: #2e7d32;
    border-color: #2e7d32;
    color: white;
  }
`;

const StickyBottomBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: white;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
  z-index: 1000;
  padding: 15px 0;
`;

const WarningBanner = styled.div`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #d32f2f;
  color: white;
  padding: 5px 20px;
  border-radius: 20px 20px 0 0;
  font-weight: 600;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const BottomBarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  
  span:first-child {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: 700;
    text-transform: uppercase;
  }
  
  span:last-child {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-main);
  }
  
  .red-text {
    color: #d32f2f !important;
  }
`;

const WhatsAppOrderBtn = styled.a`
  background-color: #25D366;
  color: white;
  padding: 12px 30px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    color: white;
  }
`;

const SideFloatingIcons = styled.div`
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 99;

  a {
    width: 45px;
    height: 45px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.1);
    }
  }

  @media (max-width: 768px) {
    right: 10px;
    gap: 8px;
    a {
      width: 35px;
      height: 35px;
      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
`;

const DUMMY_PRODUCTS = [
  { id: 1, name: "Gold Sparklers (10cm)", category: "Sparklers", price: 15, regularPrice: 150, image: sparklersImg },
  { id: 2, name: "Color Sparklers (15cm)", category: "Sparklers", price: 20, regularPrice: 200, image: sparklersImg },
  { id: 3, name: "Flower Pot Big", category: "Fountains", price: 35, regularPrice: 350, image: fountainsImg },
  { id: 4, name: "Chakkars Special", category: "Fountains", price: 25, regularPrice: 250, image: fountainsImg },
  { id: 5, name: "Sky Rocket (Pack of 10)", category: "Rockets", price: 40, regularPrice: 400, image: rocketsImg },
  { id: 6, name: "12 Shots Night Sky", category: "Night Sky", price: 80, regularPrice: 800, image: fountainsImg },
  { id: 7, name: "30 Shots Multi-color", category: "Night Sky", price: 150, regularPrice: 1500, image: fountainsImg },
  { id: 8, name: "Kalishwary Special Gift Box", category: "Gift Boxes", price: 250, regularPrice: 2500, image: sparklersImg },
];

const CATEGORIES = ["Sparklers", "Fountains", "Rockets", "Night Sky", "Gift Boxes"];

const Shop = ({ cartItems, addToCart, updateQuantity }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  const scrollToCategory = (category) => {
    const element = document.getElementById(`category-${category.replace(/\\s+/g, '-')}`);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const minOrderValue = 2500;
  const isOrderValid = totalAmount >= minOrderValue;

  const handleWhatsAppOrder = (e) => {
    if (!isOrderValid) {
      if (e) e.preventDefault();
      alert(`Minimum order value is ₹${minOrderValue}`);
      return;
    }
    setShowCheckout(true);
  };

  return (
    <ShopWrapper>
      <TopBanner />
      
      <div className="container">
        <Toolbar>
          <Breadcrumbs>
            Home / <span>Shop</span>
          </Breadcrumbs>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <SearchContainer>
              <Search size={18} color="#888" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchContainer>
            <PillsContainer>
              <Pill 
                $active={selectedCategory === 'All'} 
                onClick={() => setSelectedCategory('All')}
              >
                All Categories
              </Pill>
              {CATEGORIES.map(category => (
                <Pill 
                  key={category}
                  $active={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Pill>
              ))}
            </PillsContainer>
            <SelectBox value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Default sorting</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </SelectBox>
          </div>
        </Toolbar>

        {(selectedCategory === 'All' ? CATEGORIES : [selectedCategory]).map(category => {
          let categoryProducts = DUMMY_PRODUCTS.filter(p => 
            p.category === category && p.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (categoryProducts.length === 0) return null;

          if (sortBy === 'price_low') {
            categoryProducts.sort((a, b) => a.price - b.price);
          } else if (sortBy === 'price_high') {
            categoryProducts.sort((a, b) => b.price - a.price);
          }

          return (
            <CategorySection key={category} id={`category-${category.replace(/\\s+/g, '-')}`}>
              <CategoryHeader>{category}</CategoryHeader>
              <ProductsGrid>
                {categoryProducts.map(product => {
                  const cartItem = cartItems.find(item => item.id === product.id);
                  const qty = cartItem ? cartItem.quantity : 0;
                  
                  // Calculate discount percentage
                  const discount = Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100);

                  return (
                    <ProductCard 
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.4 }}
                    >
                      <ImageContainer>
                        <DiscountBadge>{discount}%</DiscountBadge>
                        <WishlistBtn><Heart size={16} /></WishlistBtn>
                        <img src={product.image} alt={product.name} />
                      </ImageContainer>
                      <ProductDetails>
                        <TitlePriceRow>
                          <ProductName>{product.name}</ProductName>
                          <PriceContainer>
                            <CurrentPrice>₹{product.price}</CurrentPrice>
                            {/* <RegularPrice>₹{product.regularPrice}</RegularPrice> */}
                          </PriceContainer>
                        </TitlePriceRow>
                        
                        <ProductDesc>
                          Premium quality crackers from Sivakasi. Safe & Sound.
                        </ProductDesc>

                        <RatingRow>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill="#2ecc71" color="#2ecc71" />
                          ))}
                          <ReviewCount>(121)</ReviewCount>
                        </RatingRow>
                        
                        <ActionRow>
                          {qty > 0 ? (
                            <QtyControl>
                              <button onClick={() => updateQuantity(product.id, qty - 1)}>-</button>
                              <input 
                                type="number" 
                                min="0" 
                                value={qty} 
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val) && val >= 0) {
                                    updateQuantity(product.id, val);
                                  } else if (e.target.value === '') {
                                    // if they clear it, temporarily set to 0 or leave empty visually
                                    updateQuantity(product.id, 0);
                                  }
                                }} 
                              />
                              <button onClick={() => updateQuantity(product.id, qty + 1)}>+</button>
                            </QtyControl>
                          ) : (
                            <OrderBtn onClick={() => addToCart(product)}>Add to Cart</OrderBtn>
                          )}
                        </ActionRow>
                      </ProductDetails>
                    </ProductCard>
                  );
                })}
              </ProductsGrid>
            </CategorySection>
          );
        })}
      </div>

      <SideFloatingIcons>
        <a href="/pricelist.pdf" target="_blank" title="Pricelist" rel="noreferrer" style={{ background: '#9b59b6' }}><FileText size={20} /></a>
        <Link to="/offers" title="Offers" style={{ background: '#f1c40f' }}><Gift size={20} /></Link>
        <Link to="/contact" title="Location" style={{ background: '#3498db' }}><MapPin size={20} /></Link>
        <a href="tel:+916380116372" title="Call Us" style={{ background: '#e74c3c' }}><Phone size={20} /></a>
        <a href="https://wa.me/916380116372" target="_blank" rel="noopener noreferrer" title="WhatsApp" style={{ background: '#2ecc71' }}><MessageCircle size={20} /></a>
      </SideFloatingIcons>

      <StickyBottomBar>
        {!isOrderValid && (
          <WarningBanner>
            🔥 Order value must be at least ₹2,500. 🔥
          </WarningBanner>
        )}
        <div className="container">
          <BottomBarContent>
            <StatItem>
              <span>Products</span>
              <span>{cartItems.length}</span>
            </StatItem>
            <StatItem>
              <span>Total Qty</span>
              <span>{totalQty}</span>
            </StatItem>
            <StatItem>
              <span>Est. Price</span>
              <span className="red-text">₹{totalAmount}</span>
            </StatItem>
            
            <WhatsAppOrderBtn 
              href="#" 
              onClick={handleWhatsAppOrder}
              style={{ opacity: isOrderValid ? 1 : 0.6, cursor: isOrderValid ? 'pointer' : 'not-allowed' }}
            >
              <MessageCircle size={24} /> ORDER NOW
            </WhatsAppOrderBtn>
          </BottomBarContent>
        </div>
      </StickyBottomBar>

      {showCheckout && (
        <CheckoutModal 
          cartItems={cartItems} 
          totalAmount={totalAmount} 
          onClose={() => setShowCheckout(false)} 
        />
      )}
    </ShopWrapper>
  );
};

export default Shop;
