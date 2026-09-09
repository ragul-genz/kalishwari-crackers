import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, Package, Tag, FileText, Settings, ArrowLeft, LogOut, Menu, X 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setAdminAuthenticated } from '../utils/authManager';
import { getStoredSettings } from '../utils/settingsManager';
import logoImg from '../assets/logo.jpg';
import { toast } from 'react-hot-toast';

const AdminPanelLayout = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  background-color: #f8f9fa;
  color: #212529;
  display: flex;
  z-index: 100;
  overflow: hidden;
`;

const SidebarOverlay = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(3px);
    z-index: 110;
  }
`;

const Sidebar = styled.aside`
  width: 260px;
  height: 100vh;
  box-sizing: border-box;
  background: #ffffff;
  border-right: 1px solid #e9ecef;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 16px;
  transition: transform 0.3s ease;
  z-index: 120;
  flex-shrink: 0;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #dee2e6;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.15);
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;

  img {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--brand-red, #c62828);
  }

  .brand-info {
    h2 {
      font-size: 0.95rem;
      font-family: var(--font-serif, 'Cinzel', serif);
      color: #212529;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 150px;
    }
    span {
      font-size: 0.7rem;
      color: var(--brand-red, #c62828);
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 700;
    }
  }
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 20px;
  flex: 1;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.92rem;
  font-weight: 600;
  color: ${props => props.$active ? 'var(--brand-red, #c62828)' : '#495057'};
  background: ${props => props.$active ? 'rgba(198, 40, 40, 0.08)' : 'transparent'};
  border-left: ${props => props.$active ? '4px solid var(--brand-red, #c62828)' : '4px solid transparent'};
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;

  &:hover {
    color: var(--brand-red, #c62828);
    background: rgba(198, 40, 40, 0.05);
  }

  @media (max-width: 600px) {
    padding: 8px 12px;
    font-size: 0.82rem;
    gap: 10px;
  }

  svg {
    color: ${props => props.$active ? 'var(--brand-red, #c62828)' : '#6c757d'};
  }
`;

const SidebarFooter = styled.div`
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LogoutSideBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  color: #d32f2f;
  background: #ffebee;
  border: 1px solid #ffcdd2;
  font-size: 0.88rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #d32f2f;
    color: #ffffff;
  }

  @media (max-width: 600px) {
    padding: 7px 10px;
    font-size: 0.8rem;
    gap: 8px;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  background: #f8f9fa;
`;

const TopBar = styled.header`
  height: 76px;
  min-height: 76px;
  flex-shrink: 0;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  z-index: 10;

  @media (max-width: 600px) {
    padding: 0 12px;
    height: 58px;
    min-height: 58px;
  }

  .left-section {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;

    @media (max-width: 600px) {
      gap: 8px;
    }

    h1 {
      font-family: var(--font-serif, 'Cinzel', serif);
      font-size: 1.35rem;
      font-weight: 700;
      color: #212529;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      @media (max-width: 600px) {
        font-size: 0.95rem;
        letter-spacing: 0.5px;
      }
    }
  }

  .menu-toggle {
    display: none;
    color: #212529;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    align-items: center;
    justify-content: center;

    @media (max-width: 768px) {
      display: flex;
    }
  }

  .user-status {
    font-size: 0.88rem;
    color: #6c757d;
    font-weight: 600;
    white-space: nowrap;

    @media (max-width: 600px) {
      font-size: 0.75rem;
    }

    @media (max-width: 440px) {
      display: none;
    }
  }
`;

const ContentBody = styled.div`
  padding: 24px 24px 32px 24px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f8f9fa;
  }
  &::-webkit-scrollbar-thumb {
    background: #ced4da;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #adb5bd;
  }

  @media (max-width: 600px) {
    padding: 10px 8px 18px 8px;
  }
`;

const AdminLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storeSettings, setStoreSettings] = useState(getStoredSettings());

  useEffect(() => {
    const handleUpdate = () => setStoreSettings(getStoredSettings());
    window.addEventListener('settingsUpdated', handleUpdate);
    return () => window.removeEventListener('settingsUpdated', handleUpdate);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', path: '/admin/customers', icon: Users },
    { id: 'products', label: 'Products', path: '/admin/products', icon: Package },
    { id: 'offers', label: 'Offers', path: '/admin/offers', icon: Tag },
    { id: 'blogs', label: 'Blogs', path: '/admin/blogs', icon: FileText },
    { id: 'settings', label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    setAdminAuthenticated(false);
    toast('Logged out');
    navigate('/admin/login');
  };

  const activeNavItem = navItems.find(item => 
    location.pathname === item.path || (item.id === 'products' && location.pathname === '/admin/product')
  );
  const HeaderIcon = activeNavItem ? activeNavItem.icon : null;

  return (
    <AdminPanelLayout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <SidebarOverlay $isOpen={mobileMenuOpen} onClick={() => setMobileMenuOpen(false)} />
      
      <Sidebar $isOpen={mobileMenuOpen}>
        <div>
          <SidebarHeader>
            <img src={storeSettings.logo} alt={storeSettings.shopName} />
            <div className="brand-info">
              <h2>{storeSettings.shopName}</h2>
              <span>Admin Panel</span>
            </div>
          </SidebarHeader>

          <SidebarNav>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.id === 'products' && location.pathname === '/admin/product');
              return (
                <NavItem
                  key={item.id}
                  $active={isActive}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavItem>
              );
            })}

            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e9ecef', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <NavItem onClick={() => navigate('/')}>
                <ArrowLeft size={18} />
                <span>Return to Store</span>
              </NavItem>

              <LogoutSideBtn onClick={handleLogout}>
                <LogOut size={18} />
                <span>Logout</span>
              </LogoutSideBtn>
            </div>
          </SidebarNav>
        </div>
      </Sidebar>

      <MainContent>
        <TopBar>
          <div className="left-section">
            <button className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              {HeaderIcon && (
                <HeaderIcon 
                  size={24} 
                  style={{ color: 'var(--brand-red, #c62828)', flexShrink: 0 }} 
                />
              )}
              <h1>{title}</h1>
            </div>
          </div>
          <div className="user-status">
            Logged in as <strong style={{ color: 'var(--brand-red, #c62828)' }}>Admin</strong>
          </div>
        </TopBar>

        <ContentBody>
          {children}
        </ContentBody>
      </MainContent>
    </AdminPanelLayout>
  );
};

export default AdminLayout;
