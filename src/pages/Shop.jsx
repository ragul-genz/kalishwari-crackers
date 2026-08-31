import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, CheckCircle, FileText, Gift, MapPin, Phone, MessageCircle } from 'lucide-react';
import styled from 'styled-components';
import sparklersImg from '../assets/images/sparklers.jpg';
import fountainsImg from '../assets/images/fountains.jpg';
import rocketsImg from '../assets/images/rockets.jpg';

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

const FilterContainer = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 1px solid #eaeaea;
  z-index: 100;
  min-width: 200px;
  overflow: hidden;
`;

const DropdownItem = styled.div`
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #f5f5f5;
    color: #d32f2f;
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
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ProductCard = styled.div`
  display: flex;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border: 1px solid #eaeaea;
  height: 120px;
  align-items: center;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
`;

const ImageContainer = styled.div`
  width: 120px;
  height: 120px;
  background-color: #2e7d32;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #d32f2f;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  z-index: 10;
`;

const ProductDetails = styled.div`
  flex: 1;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InfoCol = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  font-weight: 700;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 30px;
  min-width: 120px;
`;

const RegularPrice = styled.span`
  color: #ef9a9a;
  text-decoration: line-through;
  font-size: 0.85rem;
`;

const CurrentPrice = styled.span`
  font-weight: 700;
  font-size: 1.2rem;
  color: #d32f2f;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const QtyControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;

  button {
    padding: 5px 12px;
    background: #f5f5f5;
    font-weight: bold;
    &:hover { background: #e0e0e0; }
  }

  span {
    padding: 0 15px;
    font-weight: 600;
    min-width: 40px;
    text-align: center;
  }
`;

const OrderBtn = styled.button`
  background-color: #d32f2f;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  transition: all 0.2s;

  &:hover {
    background-color: #b71c1c;
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
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      e.preventDefault();
      alert(`Minimum order value is ₹${minOrderValue}`);
      return;
    }

    let message = "Hello Kalishwary Crackers! I would like to place an order:%0A%0A";
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - ${item.quantity} x ₹${item.price} = ₹${item.quantity * item.price}%0A`;
    });
    message += `%0A*Total Amount: ₹${totalAmount}*`;
    
    window.open(`https://wa.me/916380116372?text=${message}`, '_blank');
  };

  return (
    <ShopWrapper>
      <TopBanner />
      
      <div className="container">
        <Toolbar>
          <Breadcrumbs>
            Home / <span>Shop</span>
          </Breadcrumbs>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <FilterContainer ref={dropdownRef}>
              <FilterSelect onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
                <CheckCircle size={16} color="#f5b041" /> Browse Categories <ChevronDown size={16} />
              </FilterSelect>
              {isCategoryOpen && (
                <DropdownMenu>
                  {CATEGORIES.map(category => (
                    <DropdownItem 
                      key={category} 
                      onClick={() => {
                        scrollToCategory(category);
                        setIsCategoryOpen(false);
                      }}
                    >
                      {category}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              )}
            </FilterContainer>
            <SelectBox value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Default sorting</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </SelectBox>
          </div>
        </Toolbar>

        {CATEGORIES.map(category => {
          let categoryProducts = DUMMY_PRODUCTS.filter(p => p.category === category);
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
                    <ProductCard key={product.id}>
                      <ImageContainer>
                        <DiscountBadge>{discount}%</DiscountBadge>
                        <img src={product.image} alt={product.name} />
                      </ImageContainer>
                      <ProductDetails>
                        <InfoCol>
                          <ProductName>{product.name}</ProductName>
                          <span style={{ fontSize: '0.85rem', color: '#666' }}>1 packet</span>
                        </InfoCol>
                        
                        <PriceContainer>
                          <CurrentPrice>₹{product.price}</CurrentPrice>
                          <RegularPrice>₹{product.regularPrice}</RegularPrice>
                        </PriceContainer>
                        
                        <ActionRow>
                          {qty > 0 ? (
                            <QtyControl>
                              <button onClick={() => updateQuantity(product.id, qty - 1)}>-</button>
                              <span>{qty}</span>
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
    </ShopWrapper>
  );
};

export default Shop;
