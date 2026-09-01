import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Download, Star, Zap, Sun, Moon } from 'lucide-react';
import styled from 'styled-components';
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
  animation: marquee 20s linear infinite;
  
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
  z-index: 1000;
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
  flex-direction: column;
  justify-content: center;
  text-decoration: none;
`;

const LogoWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(212, 175, 55, 0.15);
  
  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
  }
`;

const LogoImage = styled.img`
  width: 90%;
  height: 90%;
  object-fit: contain;
  filter: contrast(1.4) brightness(0.85);
  mix-blend-mode: lighten;
`;

const MenuIcon = styled.div`
  display: none;
  color: var(--text-main);
  @media (max-width: 768px) {
    display: block;
    cursor: pointer;
  }
`;

const NavMenu = styled.ul`
  display: flex;
  list-style: none;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    position: absolute;
    top: 80px;
    left: ${props => (props.$isOpen ? '0' : '-100%')};
    opacity: ${props => (props.$isOpen ? '1' : '0')};
    transition: all 0.5s ease;
    background-color: var(--bg-card);
    padding: 2rem 0;
    align-items: center;
    border-bottom: 1px solid rgba(212, 175, 55, 0.1);
    z-index: 999;
  }
`;

const NavItem = styled.li``;

const NavLink = styled(Link)`
  color: var(--text-main);
  font-weight: 600;
  font-size: 0.95rem;
  transition: var(--transition);
  position: relative;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: 20px;

  ${props => props.$active && `
    background-color: var(--gold-primary);
    color: #ffffff;
  `}

  &:hover {
    color: ${props => props.$active ? '#ffffff' : 'var(--gold-primary)'};
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
    margin-right: 1rem;
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
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <HeaderWrapper $isDarkMode={isDarkMode}>
      <TopBar>
        <Marquee>
          <MarqueeItem><Zap size={16} fill="yellow" color="yellow"/> Diwali Special 50% for every purchase</MarqueeItem>
          <MarqueeItem><Zap size={16} fill="yellow" color="yellow"/> Diwali Special 50% for every purchase</MarqueeItem>
          <MarqueeItem><Zap size={16} fill="yellow" color="yellow"/> Diwali Special 50% for every purchase</MarqueeItem>
          <MarqueeItem><Zap size={16} fill="yellow" color="yellow"/> Diwali Special 50% for every purchase</MarqueeItem>
        </Marquee>
      </TopBar>
      <Nav>
        <NavContainer>
          <NavLogo to="/">
            <LogoWrapper>
              <LogoImage src={logoImg} alt="Kalishwary Crackers" />
            </LogoWrapper>
          </NavLogo>

          <MenuIcon onClick={toggleMenu}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </MenuIcon>

          <NavMenu $isOpen={isOpen}>
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
          </NavMenu>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <ThemeToggle onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </ThemeToggle>
            <DownloadBtn href="/pricelist.pdf" target="_blank">
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
