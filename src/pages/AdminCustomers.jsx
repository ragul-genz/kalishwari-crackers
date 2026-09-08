import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Phone, MapPin, Calendar, ShoppingBag, 
  Trash2, ArrowLeft, MessageCircle, DollarSign, Package, Tag, Check, Sparkles, Image as ImageIcon, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { isAdminAuthenticated } from '../utils/authManager';
import { getStoredCustomers, deleteCustomerRecord } from '../utils/customerManager';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const StatCard = styled.div`
  background: #f8f9fa;
  padding: 16px 18px;
  border-radius: 10px;
  border: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 14px;

  .stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffebee;
    color: var(--brand-red, #c62828);
    flex-shrink: 0;
  }

  p {
    color: #6c757d;
    font-size: 0.8rem;
    font-weight: 600;
    margin: 0;
  }

  h2 {
    color: #212529;
    font-size: 1.35rem;
    margin-top: 2px;
    margin-bottom: 0;
  }
`;

const FilterControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  width: 100%;
  max-width: 600px;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 8px 14px;
  gap: 10px;
  flex: 1;
  min-width: 240px;

  input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.9rem;
    width: 100%;
    color: #212529;
  }

  svg {
    color: #6c757d;
  }
`;

const DatePickerBox = styled.div`
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 6px 12px;
  gap: 6px;

  label {
    font-size: 0.78rem;
    color: #6c757d;
    font-weight: 600;
    white-space: nowrap;
  }

  input[type="date"] {
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.85rem;
    color: #212529;
    font-family: inherit;
    cursor: pointer;
  }

  .clear-date-btn {
    background: transparent;
    color: #868e96;
    padding: 2px;
    cursor: pointer;
    &:hover { color: #d32f2f; }
  }
`;

const DateGroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-left: 4px solid var(--brand-red, #c62828);
  padding: 10px 16px;
  border-radius: 8px;
  margin-top: 18px;
  margin-bottom: 12px;

  .date-title {
    font-weight: 700;
    font-size: 0.95rem;
    color: #212529;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .date-stats {
    font-size: 0.8rem;
    color: #6c757d;
    font-weight: 600;
  }
`;

/* Customer Cards Grid & List for Desktop and Mobile */
const CustomersGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CustomerCard = styled(motion.div)`
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 18px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.02);

  &:hover {
    border-color: var(--gold-primary, #D4AF37);
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0,0,0,0.06);
    background: #fffdf6;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    gap: 12px;
  }
`;

const CustomerMainInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;

  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--brand-red, #c62828), var(--brand-red-dark, #8e0000));
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .name-block {
    .name {
      font-weight: 700;
      color: #212529;
      font-size: 1.05rem;
      margin-bottom: 2px;
    }
    .id {
      font-size: 0.76rem;
      color: #868e96;
    }
  }
`;

const CustomerMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    gap: 10px;
    padding-top: 10px;
    border-top: 1px solid #f1f3f5;
  }

  .phone {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #2e7d32;
    font-weight: 600;
    font-size: 0.88rem;
  }

  .address {
    font-size: 0.84rem;
    color: #495057;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 768px) {
      max-width: 100%;
      white-space: normal;
    }
  }

  .badge {
    background: #e3f2fd;
    color: #1976d2;
    padding: 4px 10px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 0.78rem;
  }

  .amount {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--brand-red, #c62828);
  }
`;

/* Dedicated Detail Page Styling */
const DetailPageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f1f3f5;
  color: #495057;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: #e9ecef;
    color: #212529;
    transform: translateX(-3px);
  }
`;

const CustomerDetailCard = styled.div`
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e9ecef;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  margin-bottom: 24px;

  .grid-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
  }

  .info-box {
    .label {
      font-size: 0.75rem;
      color: #868e96;
      font-weight: 700;
      text-transform: uppercase;
      display: block;
      margin-bottom: 4px;
    }
    .value {
      font-size: 1rem;
      color: #212529;
      font-weight: 600;
    }
  }

  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const ProductsListContainer = styled.div`
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e9ecef;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);

  h4 {
    font-size: 1.2rem;
    font-family: var(--font-serif, 'Cinzel', serif);
    color: var(--brand-red, #c62828);
    margin-bottom: 18px;
    font-weight: 700;
  }

  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const ProductItemRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  border-bottom: 1px solid #f1f3f5;
  gap: 16px;

  &:last-child {
    border-bottom: none;
  }

  .product-thumb {
    width: 52px;
    height: 52px;
    border-radius: 8px;
    object-fit: cover;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    flex-shrink: 0;
  }

  .product-info {
    flex: 1;

    .p-name {
      font-weight: 700;
      color: #212529;
      font-size: 0.95rem;
    }
    .p-unit {
      font-size: 0.8rem;
      color: #6c757d;
    }
  }

  .product-qty-total {
    text-align: right;

    .p-qty {
      background: #e3f2fd;
      color: #1976d2;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.78rem;
      font-weight: 700;
      display: inline-block;
      margin-bottom: 2px;
    }

    .p-subtotal {
      font-size: 1rem;
      font-weight: 800;
      color: var(--brand-red, #c62828);
    }
  }

  @media (max-width: 480px) {
    gap: 10px;
    padding: 12px 6px;

    .product-thumb {
      width: 44px;
      height: 44px;
    }
    .product-info .p-name {
      font-size: 0.88rem;
    }
  }
`;

const OrderSummaryCard = styled.div`
  background: #fff9db;
  border: 1px dashed var(--gold-dark, #AA8222);
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  flex-wrap: wrap;
  gap: 16px;

  .total-label {
    font-size: 0.8rem;
    color: #6c757d;
    font-weight: 700;
    text-transform: uppercase;
  }

  .total-val {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--brand-red, #c62828);
  }

  .whatsapp-link {
    background: #25D366;
    color: #ffffff;
    padding: 10px 18px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
    }
  }
`;

/* Notification Popup */
const NotificationBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const SVGPathDrawingCheckmark = () => {
  return (
    <div style={{ width: '80px', height: '80px', marginBottom: '16px' }}>
      <motion.svg viewBox="0 0 50 50" style={{ width: '100%', height: '100%' }}>
        <motion.circle
          cx="25"
          cy="25"
          r="22"
          fill="none"
          stroke="#2e7d32"
          strokeWidth="3.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <motion.path
          fill="none"
          stroke="#2e7d32"
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 26 L22 34 L36 17"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
        />
      </motion.svg>
    </div>
  );
};

const AnimatedNotification = ({ notification, onClose }) => {
  if (!notification) return null;

  return (
    <AnimatePresence>
      <NotificationBackdrop
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div
          style={{ background: '#ffffff', borderRadius: '20px', padding: '32px 36px', textAlign: 'center', maxWidth: '400px', width: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          onClick={(e) => e.stopPropagation()}
        >
          <SVGPathDrawingCheckmark />
          <h3 style={{
            fontFamily: "var(--font-serif, 'Cinzel', serif)",
            fontSize: '1.2rem',
            fontWeight: '700',
            color: '#212529',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            margin: '0 0 8px 0'
          }}>
            {notification.title}
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#6c757d', lineHeight: '1.5', margin: 0 }}>
            {notification.message}
          </p>
        </div>
      </NotificationBackdrop>
    </AnimatePresence>
  );
};

const AdminCustomers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deletingCustomerId, setDeletingCustomerId] = useState(null);
  const [notification, setNotification] = useState(null);

  const loadCustomers = () => {
    const list = getStoredCustomers();
    setCustomers(list);
    if (selectedCustomer) {
      const match = list.find(c => c.id === selectedCustomer.id);
      if (match) setSelectedCustomer(match);
    }
  };

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    loadCustomers();

    const handleUpdate = () => {
      loadCustomers();
    };

    window.addEventListener('customersUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('focus', handleUpdate);
    return () => {
      window.removeEventListener('customersUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  }, [navigate]);

  const triggerNotify = (title, message) => {
    setNotification({ title, message });
    setTimeout(() => {
      setNotification(null);
    }, 2200);
  };

  const confirmDelete = () => {
    if (deletingCustomerId) {
      const updated = deleteCustomerRecord(deletingCustomerId);
      setCustomers(updated);
      if (selectedCustomer && selectedCustomer.id === deletingCustomerId) {
        setSelectedCustomer(null);
      }
      setDeletingCustomerId(null);
      triggerNotify('Record Deleted', 'Customer WhatsApp order record removed.');
    }
  };

  // Helper to extract clean date header string
  const getOrderDateHeader = (cust) => {
    if (cust.dateOnly) return cust.dateOnly;
    if (cust.date) {
      const parts = cust.date.split(/\d{2}:\d{2}/)[0].trim();
      if (parts) return parts;
    }
    return 'Recent Orders';
  };

  // Filter customers by Search Term AND Date Filter
  const filteredCustomers = customers.filter(c => {
    const term = searchTerm.toLowerCase().trim();
    const matchesText = !term ||
      (c.name || '').toLowerCase().includes(term) ||
      (c.phone || '').includes(term) ||
      (c.address || '').toLowerCase().includes(term) ||
      (c.pincode || '').includes(term) ||
      (c.date || '').toLowerCase().includes(term) ||
      (c.dateOnly || '').toLowerCase().includes(term);

    let matchesDate = true;
    if (selectedDateFilter) {
      const targetDate = selectedDateFilter; // e.g. "2026-09-08"
      if (c.isoDate) {
        matchesDate = c.isoDate === targetDate;
      } else if (c.date) {
        // Fallback check against formatted date string
        const parsedISO = new Date(c.date).toISOString().split('T')[0];
        matchesDate = parsedISO === targetDate || c.date.includes(targetDate);
      }
    }

    return matchesText && matchesDate;
  });

  // Group filtered customers date-wise
  const groupedCustomers = filteredCustomers.reduce((acc, cust) => {
    const dateKey = getOrderDateHeader(cust);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(cust);
    return acc;
  }, {});

  const totalRevenue = customers.reduce((acc, c) => acc + (c.totalAmount || 0), 0);
  const totalProductsSold = customers.reduce((acc, c) => acc + (c.itemsCount || 0), 0);

  return (
    <AdminLayout title="Customers">
      {/* Dynamic View Switch: Customer Directory OR Dedicated Customer Detail Page */}
      {selectedCustomer ? (
        /* DEDICATED CUSTOMER DETAIL PAGE VIEW */
        <PageContainer>
          <DetailPageHeader>
            <BackButton onClick={() => setSelectedCustomer(null)}>
              <ArrowLeft size={18} /> Back to Customers List
            </BackButton>

            <div style={{ display: 'flex', gap: '10px' }}>
              <a 
                href={`https://wa.me/91${selectedCustomer.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(selectedCustomer.name)}!%20Regarding%20your%20Kalishwari%20Crackers%20Order`}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: '#25D366',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none'
                }}
              >
                <MessageCircle size={16} /> Contact Customer
              </a>

              <button
                onClick={() => setDeletingCustomerId(selectedCustomer.id)}
                style={{
                  background: '#ffebee',
                  color: '#d32f2f',
                  border: '1px solid #ffcdd2',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={16} /> Delete Order
              </button>
            </div>
          </DetailPageHeader>

          {/* Customer Details Card */}
          <CustomerDetailCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid #e9ecef' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--brand-red, #c62828), var(--brand-red-dark, #8e0000))',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.25rem'
              }}>
                {(selectedCustomer.name || 'C')[0].toUpperCase()}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#212529', fontFamily: "var(--font-serif, 'Cinzel', serif)" }}>
                  {selectedCustomer.name}
                </h3>
              </div>
            </div>

            <div className="grid-info">
              <div className="info-box">
                <span className="label">Mobile / WhatsApp</span>
                <span className="value" style={{ color: '#2e7d32' }}>+91 {selectedCustomer.phone}</span>
              </div>

              <div className="info-box">
                <span className="label">Order Date & Time</span>
                <span className="value">{selectedCustomer.date}</span>
              </div>

              <div className="info-box" style={{ gridColumn: 'span 2' }}>
                <span className="label">Delivery Address & Pincode</span>
                <span className="value">{selectedCustomer.address} - PIN ({selectedCustomer.pincode})</span>
              </div>
            </div>
          </CustomerDetailCard>

          {/* Ordered Products Breakdown with Thumbnails and S.No */}
          <ProductsListContainer>
            <h4>
              Ordered Fireworks Breakdown ({selectedCustomer.itemsCount} Items)
            </h4>

            {(selectedCustomer.cartItems || []).map((item, idx) => (
              <ProductItemRow key={idx}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#6c757d', minWidth: '24px' }}>
                  {idx + 1}.
                </span>
                {item.image ? (
                  <img src={item.image} alt={item.name} className="product-thumb" />
                ) : (
                  <div className="product-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd' }}>
                    <ImageIcon size={20} />
                  </div>
                )}

                <div className="product-info">
                  <div className="p-name">{item.name}</div>
                  <div className="p-unit">Unit Price: ₹{item.price}</div>
                </div>

                <div className="product-qty-total">
                  <span className="p-qty">Qty: {item.quantity}</span>
                  <div className="p-subtotal">₹{item.totalItemPrice || (item.price * item.quantity)}</div>
                </div>
              </ProductItemRow>
            ))}

            <OrderSummaryCard>
              <div>
                <span className="total-label">Grand Total Amount</span>
                <div className="total-val">₹{selectedCustomer.totalAmount}</div>
              </div>

              <a 
                href={`https://wa.me/91${selectedCustomer.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(selectedCustomer.name)}!%20Thank%20you%20for%20your%20order%20at%20Kalishwari%20Crackers.`}
                target="_blank"
                rel="noreferrer"
                className="whatsapp-link"
              >
                <MessageCircle size={18} /> Open WhatsApp Chat
              </a>
            </OrderSummaryCard>
          </ProductsListContainer>
        </PageContainer>
      ) : (
        /* MAIN CUSTOMER DIRECTORY LIST VIEW (DATE-WISE GROUPED) */
        <div style={{ background: '#ffffff', padding: '28px 24px', borderRadius: '12px', border: '1px solid #e9ecef', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ color: 'var(--brand-red, #c62828)', fontSize: '1.35rem', fontFamily: "var(--font-serif, 'Cinzel', serif)", fontWeight: 700 }}>
                WhatsApp Orders & Customers
              </h3>
              <p style={{ color: '#6c757d', fontSize: '0.82rem', marginTop: '2px' }}>
                Organized date-wise. Search by name, phone, address or select a date filter.
              </p>
            </div>

            <FilterControlsRow>
              <SearchBox>
                <Search size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name, phone, address, date..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchBox>

              <DatePickerBox>
                <label>Filter Date:</label>
                <input 
                  type="date" 
                  value={selectedDateFilter}
                  onChange={(e) => setSelectedDateFilter(e.target.value)}
                />
                {selectedDateFilter && (
                  <button 
                    type="button" 
                    className="clear-date-btn" 
                    title="Clear Date Filter"
                    onClick={() => setSelectedDateFilter('')}
                  >
                    <X size={16} />
                  </button>
                )}
              </DatePickerBox>
            </FilterControlsRow>
          </div>

          <StatsGrid>
            <StatCard>
              <div className="stat-icon">
                <Users size={22} />
              </div>
              <div>
                <p>Total Customers</p>
                <h2>{customers.length} Orders</h2>
              </div>
            </StatCard>

            <StatCard>
              <div className="stat-icon" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                <DollarSign size={22} />
              </div>
              <div>
                <p>Total Revenue</p>
                <h2>₹{totalRevenue.toLocaleString()}</h2>
              </div>
            </StatCard>

            <StatCard>
              <div className="stat-icon" style={{ background: '#e3f2fd', color: '#1976d2' }}>
                <Package size={22} />
              </div>
              <div>
                <p>Products Ordered</p>
                <h2>{totalProductsSold} Items</h2>
              </div>
            </StatCard>
          </StatsGrid>

          <PageContainer style={{ marginTop: '16px' }}>
            {filteredCustomers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 20px', background: '#f8f9fa', borderRadius: '12px', border: '1px dashed #ced4da' }}>
                <Users size={44} color="#adb5bd" style={{ marginBottom: '10px' }} />
                <h4 style={{ color: '#495057', margin: '0 0 6px 0' }}>No Customer Orders Found</h4>
                <p style={{ color: '#868e96', margin: 0, fontSize: '0.88rem' }}>
                  {searchTerm || selectedDateFilter ? 'No WhatsApp orders match the selected search or date filter.' : 'When a customer places an order via WhatsApp, their order card will appear here live!'}
                </p>
              </div>
            ) : (
              <div>
                {/* Render Date Groups */}
                {Object.keys(groupedCustomers).map((dateHeaderKey) => {
                  const dateOrders = groupedCustomers[dateHeaderKey];
                  const dateTotalRevenue = dateOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
                  const dateTotalItems = dateOrders.reduce((acc, o) => acc + (o.itemsCount || 0), 0);

                  return (
                    <div key={dateHeaderKey} style={{ marginBottom: '24px' }}>
                      <DateGroupHeader>
                        <div className="date-title">
                          <Calendar size={16} color="var(--brand-red, #c62828)" />
                          <span>{dateHeaderKey}</span>
                        </div>
                        <div className="date-stats">
                          {dateOrders.length} {dateOrders.length === 1 ? 'Order' : 'Orders'} • Total: ₹{dateTotalRevenue.toLocaleString()} ({dateTotalItems} Items)
                        </div>
                      </DateGroupHeader>

                      <CustomersGrid>
                        {dateOrders.map((cust, index) => (
                          <CustomerCard
                            key={cust.id}
                            onClick={() => setSelectedCustomer(cust)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CustomerMainInfo>
                              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--brand-red, #c62828)', minWidth: '28px' }}>
                                #{index + 1}
                              </span>
                              <div className="avatar">
                                {(cust.name || 'C')[0].toUpperCase()}
                              </div>
                              <div className="name-block">
                                <div className="name">{cust.name}</div>
                                <div className="id">{cust.date}</div>
                              </div>
                            </CustomerMainInfo>

                            <CustomerMeta>
                              <span className="phone">
                                <Phone size={14} /> +91 {cust.phone}
                              </span>

                              <span className="address" title={`${cust.address} (${cust.pincode})`}>
                                <MapPin size={13} color="#d32f2f" style={{ marginRight: '4px' }} />
                                {cust.address}
                              </span>

                              <span className="badge">
                                {cust.itemsCount} Items
                              </span>

                              <span className="amount">
                                ₹{cust.totalAmount}
                              </span>
                            </CustomerMeta>
                          </CustomerCard>
                        ))}
                      </CustomersGrid>
                    </div>
                  );
                })}
              </div>
            )}
          </PageContainer>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingCustomerId && (
          <NotificationBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeletingCustomerId(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '400px', width: '90%', textAlign: 'center', padding: '28px 24px' }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#ffebee',
                border: '1px solid #ffcdd2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <Trash2 size={26} color="#d32f2f" />
              </div>

              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#212529' }}>
                Delete Customer Order?
              </h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '0.88rem', color: '#6c757d', lineHeight: '1.5' }}>
                Are you sure you want to remove this WhatsApp customer order from your admin dashboard?
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setDeletingCustomerId(null)}
                  style={{ padding: '10px 20px', borderRadius: '8px', background: '#e9ecef', color: '#495057', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  style={{ padding: '10px 20px', borderRadius: '8px', background: '#d32f2f', color: '#ffffff', fontWeight: 600 }}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </NotificationBackdrop>
        )}
      </AnimatePresence>

      {/* Animated Green Checkmark Notification */}
      <AnimatedNotification notification={notification} onClose={() => setNotification(null)} />
    </AdminLayout>
  );
};

export default AdminCustomers;
