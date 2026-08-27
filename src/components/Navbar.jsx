import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Download, Star, Zap } from 'lucide-react';
import styled from 'styled-components';

const TopBar = styled.div`
  background-color: #d32f2f;
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
`;

const Nav = styled.nav`
  background-color: #ffffff;
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

const LogoText = styled.span`
  font-family: var(--font-serif);
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  line-height: 1;
  color: #d32f2f;
`;

const LogoSubtext = styled.span`
  font-size: 0.75rem;
  color: #555;
  letter-spacing: 3px;
  margin-top: 4px;
`;

const MenuIcon = styled.div`
  display: none;
  color: #333;
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
    background-color: #ffffff;
    padding: 2rem 0;
    align-items: center;
    border-bottom: 1px solid #eee;
    z-index: 999;
  }
`;

const NavItem = styled.li``;

const NavLink = styled(Link)`
  color: #333;
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
    background-color: #d32f2f;
    color: white;
  `}

  &:hover {
    color: ${props => props.$active ? 'white' : '#d32f2f'};
  }
`;

const DownloadBtn = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #d32f2f;
  border: 1px solid #d32f2f;
  padding: 8px 20px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background-color: #d32f2f;
    color: white;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const CartIconContainer = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  color: #333;
  transition: var(--transition);
  text-decoration: none;

  &:hover {
    transform: scale(1.1);
    color: #d32f2f;
  }

  @media (max-width: 768px) {
    margin-right: 1rem;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -12px;
  background-color: #d32f2f;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const Navbar = ({ cartCount }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <HeaderWrapper>
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
            <LogoText>KALISHWARY</LogoText>
            <LogoSubtext>PREMIUM QUALITY</LogoSubtext>
          </NavLogo>

          <MenuIcon onClick={toggleMenu}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </MenuIcon>

          <NavMenu $isOpen={isOpen}>
            <NavItem>
              <NavLink to="/" $active={true} onClick={toggleMenu}>Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/shop" onClick={toggleMenu}>Shop</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/offers" onClick={toggleMenu}><Star size={16} fill="#ffc107" color="#ffc107"/> Offers</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/blog" onClick={toggleMenu}>Blog</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/about" onClick={toggleMenu}>About Us</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/contact" onClick={toggleMenu}>Contact</NavLink>
            </NavItem>
          </NavMenu>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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
