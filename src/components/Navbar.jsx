import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Download, Star, Zap, Sun, Moon } from 'lucide-react';
import styled from 'styled-components';
import { getStoredSettings } from '../utils/settingsManager';
import logoImg from '../assets/logo.jpg';

const TopBar = styled.div`
  background-color: var(--brand-red);
  color: white;
  padding: 8px 0;
  overflow: hidden;
  display: flex;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: var(--font-sans);
`;

const Marquee = styled.div`
  display: flex;
  white-space: nowrap;
  animation: marquee 25s linear infinite;
  
  @keyframes marquee {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
`;

const MarqueeItem = styled.span`
  display: flex;
  align-items: center;
  margin-right: 50px;
  gap: 5px;
`;

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: ${props => (props.$isOpen ? 999999 : 1000)};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  background: ${props => props.$isDarkMode ? 'rgba(18, 18, 18, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const Nav = styled.nav`
  height: 80px;
  display: flex;
  align-items: center;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const NavLogo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
`;

const LogoWrapper = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  border: 2px solid var(--brand-red, #c62828);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
  }
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ShopTitleText = styled.span`
  font-family: var(--font-serif, 'Cinzel', serif);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: 1px;
  white-space: nowrap;

  @media (max-width: 900px) {
    font-size: 0.95rem;
  }
  @media (max-width: 480px) {
    display: none;
  }
`;

const NavLeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MenuIcon = styled.div`
  display: none;
  color: var(--text-main);
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    &:hover {
      background: rgba(212, 175, 55, 0.1);
    }
  }
`;

const NavBackdrop = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: ${props => (props.$isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 999988;
  }
`;

const NavMenu = styled.ul`
  display: flex;
  list-style: none;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 280px;
    height: auto;
    max-height: 100vh;
    border-bottom-right-radius: 16px;
    position: fixed;
    top: 0;
    left: ${props => (props.$isOpen ? '0' : '-100%')};
    opacity: ${props => (props.$isOpen ? '1' : '0')};
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    background-color: var(--bg-card);
    padding: 1.2rem 1rem 1.5rem 1rem;
    align-items: flex-start;
    gap: 0.5rem;
    border-right: 1px solid rgba(212, 175, 55, 0.2);
    border-bottom: 1px solid rgba(212, 175, 55, 0.2);
    box-shadow: 6px 6px 25px rgba(0, 0, 0, 0.4);
    z-index: 999999;
  }
`;

const DrawerHeader = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding-bottom: 10px;
    margin-bottom: 8px;
    border-bottom: 1px solid rgba(212, 175, 55, 0.2);
    gap: 8px;
  }
`;

const DrawerTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 0.82rem;
  color: var(--gold-primary);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }
`;

const DrawerCloseBtn = styled.button`
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(198, 40, 40, 0.2);
    color: var(--brand-red);
  }
`;

const NavItem = styled.li`
  width: 100%;
  &.mobile-pricelist-link {
    display: none;
    @media (max-width: 768px) {
      display: block;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid rgba(212, 175, 55, 0.15);
      width: 100%;
    }
  }
`;

const NavLink = styled(Link)`
  color: var(--text-main);
  font-weight: 600;
  font-size: 0.95rem;
  transition: var(--transition);
  position: relative;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;

  ${props => props.$active && `
    background-color: var(--gold-primary);
    color: #ffffff;
  `}

  &:hover {
    color: ${props => props.$active ? '#ffffff' : 'var(--gold-primary)'};
    background-color: rgba(212, 175, 55, 0.1);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const DownloadBtn = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--gold-primary);
  border: 1px solid var(--gold-primary);
  padding: 8px 20px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--gold-primary);
    color: #ffffff;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ThemeToggle = styled.button`
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    color: var(--gold-primary);
  }
`;

const CartIconContainer = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  color: var(--text-main);
  transition: var(--transition);
  text-decoration: none;

  &:hover {
    transform: scale(1.1);
    color: var(--gold-primary);
  }

  @media (max-width: 768px) {
    margin-right: 0.5rem;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -12px;
  background-color: var(--brand-red);
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const Navbar = ({ cartCount, isDarkMode, setIsDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [storeSettings, setStoreSettings] = useState(getStoredSettings());
  const location = useLocation();

  useEffect(() => {
    const handleUpdate = () => setStoreSettings(getStoredSettings());
    window.addEventListener('settingsUpdated', handleUpdate);
    return () => window.removeEventListener('settingsUpdated', handleUpdate);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <HeaderWrapper $isDarkMode={isDarkMode} $isOpen={isOpen}>
      <TopBar>
        <Marquee>
          <MarqueeItem><Zap size={16} fill="yellow" color="yellow"/> {storeSettings.adBannerText}</MarqueeItem>
          <MarqueeItem><Zap size={16} fill="yellow" color="yellow"/> {storeSettings.adBannerText}</MarqueeItem>
        </Marquee>
      </TopBar>
      <Nav>
        <NavContainer>
          <NavLeftGroup>
            <MenuIcon onClick={toggleMenu}>
              <Menu size={26} />
            </MenuIcon>

            <NavLogo to="/">
              <LogoWrapper>
                <LogoImage src={storeSettings.logo} alt={storeSettings.shopName} />
              </LogoWrapper>
              <ShopTitleText>{storeSettings.shopName}</ShopTitleText>
            </NavLogo>
          </NavLeftGroup>

          <NavBackdrop $isOpen={isOpen} onClick={() => setIsOpen(false)} />

          <NavMenu $isOpen={isOpen}>
            <DrawerHeader>
              <DrawerTitle>
                <LogoWrapper style={{ width: '30px', height: '30px' }}>
                  <LogoImage src={storeSettings.logo} alt={storeSettings.shopName} />
                </LogoWrapper>
                <span>{storeSettings.shopName}</span>
              </DrawerTitle>
              <DrawerCloseBtn onClick={toggleMenu} aria-label="Close menu">
                <X size={22} />
              </DrawerCloseBtn>
            </DrawerHeader>

            <NavItem>
              <NavLink to="/" $active={location.pathname === '/'} onClick={toggleMenu}>Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/shop" $active={location.pathname === '/shop'} onClick={toggleMenu}>Shop</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/offers" $active={location.pathname === '/offers'} onClick={toggleMenu}><Star size={16} fill="#ffc107" color="#ffc107"/> Offers</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/blogs" $active={location.pathname === '/blogs'} onClick={toggleMenu}>Blog</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/about" $active={location.pathname === '/about'} onClick={toggleMenu}>About Us</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/contact" $active={location.pathname === '/contact'} onClick={toggleMenu}>Contact</NavLink>
            </NavItem>
            <NavItem className="mobile-pricelist-link">
              <a 
                href={storeSettings.priceList || "/pricelist.pdf"} 
                target="_blank" 
                rel="noreferrer"
                download={storeSettings.priceListName || "Kalishwari_Crackers_Pricelist"}
                style={{
                  color: 'var(--gold-primary)',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid var(--gold-primary)'
                }}
                onClick={toggleMenu}
              >
                <Download size={16} /> Download Pricelist
              </a>
            </NavItem>
          </NavMenu>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <DownloadBtn 
              href={storeSettings.priceList || "/pricelist.pdf"} 
              target="_blank" 
              rel="noreferrer"
              download={storeSettings.priceListName || "Kalishwari_Crackers_Pricelist"}
            >
              <Download size={18} /> Download Pricelist
            </DownloadBtn>
            <CartIconContainer to="/cart">
              <ShoppingCart size={24} />
              {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
            </CartIconContainer>
          </div>
        </NavContainer>
      </Nav>
    </HeaderWrapper>
  );
};

export default Navbar;
