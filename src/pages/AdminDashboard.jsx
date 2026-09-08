import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  DollarSign, ShoppingBag, Package, Tag, FileText, Users, 
  TrendingUp, Calendar, ArrowRight, MessageCircle, Clock 
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { isAdminAuthenticated } from '../utils/authManager';
import { getStoredCustomers } from '../utils/customerManager';
import { getStoredProducts } from '../utils/productManager';
import { getStoredOffers } from '../utils/offerManager';
import { getStoredBlogs } from '../utils/blogManager';

const PageCardContainer = styled.div`
  background: #ffffff;
  padding: 24px 24px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 12px 8px;
    border-radius: 10px;
  }
`;

const HeaderTitleBox = styled.div`
  margin-bottom: 20px;

  h3 {
    color: var(--brand-red, #c62828);
    font-size: 1.35rem;
    font-family: var(--font-serif, 'Cinzel', serif);
    font-weight: 700;
    margin: 0;

    @media (max-width: 600px) {
      font-size: 1rem;
      letter-spacing: 0.5px;
    }
  }

  p {
    color: #6c757d;
    font-size: 0.82rem;
    margin-top: 2px;
    margin-bottom: 0;

    @media (max-width: 600px) {
      font-size: 0.74rem;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 600px) {
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 10px;
    margin-bottom: 16px;
  }
`;

const StatCard = styled(motion.div)`
  background: #f8f9fa;
  padding: 18px 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
    border-color: #ced4da;
  }

  @media (max-width: 600px) {
    padding: 12px 10px;
    gap: 10px;
    border-radius: 10px;
  }

  .stat-icon {
    width: 46px;
    height: 46px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    @media (max-width: 600px) {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      svg {
        width: 18px;
        height: 18px;
      }
    }
  }

  .stat-info {
    min-width: 0;
    flex: 1;

    p {
      color: #6c757d;
      font-size: 0.78rem;
      font-weight: 600;
      margin: 0;

      @media (max-width: 600px) {
        font-size: 0.7rem;
      }
    }

    h2 {
      color: #212529;
      font-size: 1.35rem;
      font-weight: 800;
      margin-top: 2px;
      margin-bottom: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      @media (max-width: 600px) {
        font-size: 1rem;
      }
    }
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;

  h4 {
    color: var(--brand-red, #c62828);
    font-size: 1.1rem;
    font-family: var(--font-serif, 'Cinzel', serif);
    font-weight: 700;
    margin: 0;

    @media (max-width: 600px) {
      font-size: 0.9rem;
    }
  }

  a {
    color: var(--brand-red, #c62828);
    font-size: 0.82rem;
    font-weight: 600;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ActivityCard = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 12px 10px;
    border-radius: 10px;
  }
`;

const RecentOrderItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  margin-bottom: 8px;
  gap: 10px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 600px) {
    padding: 8px 10px;
    gap: 6px;
  }

  .cust-name {
    font-weight: 700;
    font-size: 0.88rem;
    color: #212529;

    @media (max-width: 600px) {
      font-size: 0.8rem;
    }
  }

  .cust-date {
    font-size: 0.75rem;
    color: #868e96;
  }

  .cust-amount {
    font-weight: 800;
    color: var(--brand-red, #c62828);
    font-size: 0.92rem;

    @media (max-width: 600px) {
      font-size: 0.82rem;
    }
  }
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [blogs, setBlogs] = useState([]);

  const loadAllDashboardData = () => {
    setCustomers(getStoredCustomers());
    setProducts(getStoredProducts());
    setOffers(getStoredOffers());
    setBlogs(getStoredBlogs());
  };

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    loadAllDashboardData();

    const handleUpdate = () => {
      loadAllDashboardData();
    };

    window.addEventListener('customersUpdated', handleUpdate);
    window.addEventListener('productsUpdated', handleUpdate);
    window.addEventListener('offersUpdated', handleUpdate);
    window.addEventListener('blogsUpdated', handleUpdate);
    window.addEventListener('settingsUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('focus', handleUpdate);

    return () => {
      window.removeEventListener('customersUpdated', handleUpdate);
      window.removeEventListener('productsUpdated', handleUpdate);
      window.removeEventListener('offersUpdated', handleUpdate);
      window.removeEventListener('blogsUpdated', handleUpdate);
      window.removeEventListener('settingsUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  }, [navigate]);

  const totalRevenue = customers.reduce((acc, c) => acc + (c.totalAmount || 0), 0);
  const activeProductsCount = products.filter(p => p.stock !== 'Out of Stock').length;
  const activeOffersCount = offers.filter(o => o.status === 'Active').length;

  return (
    <AdminLayout title="Dashboard">
      <PageCardContainer>
        <HeaderTitleBox>
          <h3>Dashboard Overview</h3>
          <p>Live real-time store metrics, WhatsApp orders and sales performance</p>
        </HeaderTitleBox>

        <StatsGrid>
          <StatCard
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            <div className="stat-icon" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <p>Total Revenue</p>
              <h2>₹{totalRevenue.toLocaleString('en-IN')}</h2>
            </div>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <div className="stat-icon" style={{ background: '#ffebee', color: 'var(--brand-red, #c62828)' }}>
              <ShoppingBag size={24} />
            </div>
            <div className="stat-info">
              <p>Total Orders</p>
              <h2>{customers.length}</h2>
            </div>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            <div className="stat-icon" style={{ background: '#e3f2fd', color: '#1976d2' }}>
              <Package size={24} />
            </div>
            <div className="stat-info">
              <p>Active Products</p>
              <h2>{products.length}</h2>
            </div>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            <div className="stat-icon" style={{ background: '#fff9db', color: '#b78103' }}>
              <Tag size={24} />
            </div>
            <div className="stat-info">
              <p>Live Offers</p>
              <h2>{activeOffersCount}</h2>
            </div>
          </StatCard>
        </StatsGrid>

        <ActivityCard>
          <SectionHeader>
            <h4>Recent Sales Activity</h4>
            <Link to="/admin/customers">
              View All Orders <ArrowRight size={14} />
            </Link>
          </SectionHeader>

          {customers.length === 0 ? (
            <p style={{ color: '#868e96', fontSize: '0.88rem', margin: 0, padding: '12px 0' }}>
              No WhatsApp orders received yet. Live sales activity will update automatically as orders arrive!
            </p>
          ) : (
            customers.slice(0, 5).map(cust => (
              <RecentOrderItem key={cust.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--brand-red, #c62828), #8e0000)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    {(cust.name || 'C')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="cust-name">{cust.name}</div>
                    <div className="cust-date">{cust.date} • {cust.itemsCount} Items</div>
                  </div>
                </div>

                <div className="cust-amount">
                  ₹{cust.totalAmount.toLocaleString('en-IN')}
                </div>
              </RecentOrderItem>
            ))
          )}
        </ActivityCard>
      </PageCardContainer>
    </AdminLayout>
  );
};

export default AdminDashboard;
