import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Phone, MapPin, Calendar, ShoppingBag, 
  Eye, Trash2, X, MessageCircle, DollarSign, Package, Tag, Check
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
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 12px;
`;

const StatCard = styled.div`
  background: #f8f9fa;
  padding: 18px 20px;
  border-radius: 10px;
  border: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 16px;

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffebee;
    color: var(--brand-red, #c62828);
  }

  p {
    color: #6c757d;
    font-size: 0.82rem;
    font-weight: 600;
    margin: 0;
  }

  h2 {
    color: #212529;
    font-size: 1.45rem;
    margin-top: 2px;
    margin-bottom: 0;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 8px 14px;
  gap: 10px;
  max-width: 400px;
  width: 100%;

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

const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid #e9ecef;
  border-radius: 8px;

  table {
    width: 100%;
    border-collapse: collapse;
    textAlign: left;
    font-size: 0.88rem;
    min-width: 750px;

    th {
      background: #f8f9fa;
      color: var(--brand-red, #c62828);
      font-weight: 700;
      padding: 12px 14px;
      border-bottom: 2px solid #e9ecef;
    }

    td {
      padding: 14px;
      border-bottom: 1px solid #f1f3f5;
      vertical-align: middle;
    }

    tr:hover {
      background: #fafafa;
    }
  }
`;

const ActionBtn = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  cursor: pointer;

  &.view-btn {
    background: #e3f2fd;
    color: #1976d2;
    border: 1px solid #bbdefb;
    &:hover { background: #bbdefb; }
  }

  &.delete-btn {
    background: #ffebee;
    color: #d32f2f;
    border: 1px solid #ffcdd2;
    &:hover { background: #ffcdd2; }
  }
`;

/* Modal Components */
const ModalBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9990;
  padding: 20px;
`;

const ModalCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 620px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 28px;
  box-shadow: 0 12px 36px rgba(0,0,0,0.2);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e9ecef;

  h3 {
    margin: 0;
    font-size: 1.3rem;
    color: #212529;
    font-family: var(--font-serif, 'Cinzel', serif);
  }

  button {
    color: #868e96;
    &:hover { color: #212529; }
  }
`;

const CustomerInfoBox = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 550px) {
    grid-template-columns: 1fr;
  }

  .info-item {
    span.label {
      font-size: 0.75rem;
      color: #868e96;
      display: block;
      font-weight: 600;
      text-transform: uppercase;
    }
    span.val {
      font-size: 0.92rem;
      color: #212529;
      font-weight: 600;
    }
  }
`;

const OrderItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  font-size: 0.88rem;

  th {
    background: #f1f3f5;
    padding: 8px 12px;
    font-weight: 700;
    color: #495057;
    text-align: left;
    border-bottom: 2px solid #dee2e6;
  }

  td {
    padding: 10px 12px;
    border-bottom: 1px solid #e9ecef;
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

const NotificationBoxCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 20px;
  padding: 32px 36px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
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
        <NotificationBoxCard
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 450, damping: 26 }}
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
        </NotificationBoxCard>
      </NotificationBackdrop>
    </AnimatePresence>
  );
};

const AdminCustomers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deletingCustomerId, setDeletingCustomerId] = useState(null);
  const [notification, setNotification] = useState(null);

  const loadCustomers = () => {
    setCustomers(getStoredCustomers());
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
      setDeletingCustomerId(null);
      if (selectedCustomer && selectedCustomer.id === deletingCustomerId) {
        setSelectedCustomer(null);
      }
      triggerNotify('Record Deleted', 'Customer WhatsApp order record removed.');
    }
  };

  const filteredCustomers = customers.filter(c => 
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone || '').includes(searchTerm) ||
    (c.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.pincode || '').includes(searchTerm) ||
    (c.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = customers.reduce((acc, c) => acc + (c.totalAmount || 0), 0);
  const totalProductsSold = customers.reduce((acc, c) => acc + (c.itemsCount || 0), 0);

  return (
    <AdminLayout title="Customers">
      <div style={{ background: '#ffffff', padding: '28px 28px 24px 28px', borderRadius: '12px', border: '1px solid #e9ecef', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ color: 'var(--brand-red, #c62828)', fontSize: '1.35rem', fontFamily: "var(--font-serif, 'Cinzel', serif)", fontWeight: 700 }}>
              WhatsApp Orders & Customers
            </h3>
            <p style={{ color: '#6c757d', fontSize: '0.82rem', marginTop: '2px' }}>
              Real-time records of customers who placed orders via WhatsApp with their complete cart items
            </p>
          </div>

          <SearchContainer>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by name, phone, address, pincode..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
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

        <PageContainer>
          <TableWrapper>
            <table>
              <thead>
                <tr>
                  <th>Customer Name & ID</th>
                  <th>Phone / WhatsApp</th>
                  <th>Delivery Address</th>
                  <th>Order Date</th>
                  <th>Items Count</th>
                  <th>Total Amount</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#6c757d' }}>
                      {searchTerm ? `No WhatsApp orders match search "${searchTerm}"` : 'No WhatsApp customer orders recorded yet. When a customer places an order via WhatsApp, their cart breakdown will appear here live!'}
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map(cust => (
                    <tr key={cust.id}>
                      <td>
                        <strong style={{ color: '#212529', display: 'block' }}>{cust.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#868e96' }}>ID: {cust.id}</span>
                      </td>

                      <td>
                        <a 
                          href={`https://wa.me/91${cust.phone.replace(/\D/g, '')}`} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2e7d32', fontWeight: 600 }}
                        >
                          <MessageCircle size={15} /> +91 {cust.phone}
                        </a>
                      </td>

                      <td style={{ maxWidth: '220px', color: '#495057' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                          <MapPin size={14} color="#d32f2f" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <div>
                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cust.address}</div>
                            <span style={{ fontSize: '0.75rem', color: '#868e96' }}>PIN: {cust.pincode}</span>
                          </div>
                        </div>
                      </td>

                      <td style={{ color: '#6c757d', fontSize: '0.82rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={13} /> {cust.date}
                        </div>
                      </td>

                      <td>
                        <span style={{ background: '#e3f2fd', color: '#1976d2', padding: '4px 10px', borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem' }}>
                          {cust.itemsCount} Products
                        </span>
                      </td>

                      <td style={{ fontWeight: 800, color: 'var(--brand-red, #c62828)', fontSize: '0.95rem' }}>
                        ₹{cust.totalAmount}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <ActionBtn className="view-btn" onClick={() => setSelectedCustomer(cust)}>
                            <Eye size={15} /> View Products
                          </ActionBtn>
                          <ActionBtn className="delete-btn" onClick={() => setDeletingCustomerId(cust.id)}>
                            <Trash2 size={15} />
                          </ActionBtn>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </TableWrapper>
        </PageContainer>
      </div>

      {/* Customer Order Details Breakdown Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <ModalBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCustomer(null)}
          >
            <ModalCard
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <h3>Customer Cart Breakdown</h3>
                <button onClick={() => setSelectedCustomer(null)}><X size={20} /></button>
              </ModalHeader>

              <CustomerInfoBox>
                <div className="info-item">
                  <span className="label">Customer Name</span>
                  <span className="val">{selectedCustomer.name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Phone / WhatsApp</span>
                  <span className="val" style={{ color: '#2e7d32' }}>+91 {selectedCustomer.phone}</span>
                </div>
                <div className="info-item" style={{ gridColumn: 'span 2' }}>
                  <span className="label">Delivery Address & Pincode</span>
                  <span className="val">{selectedCustomer.address} - (PIN: {selectedCustomer.pincode})</span>
                </div>
                <div className="info-item">
                  <span className="label">Order Date & Time</span>
                  <span className="val" style={{ fontSize: '0.85rem' }}>{selectedCustomer.date}</span>
                </div>
                <div className="info-item">
                  <span className="label">Customer ID</span>
                  <span className="val" style={{ fontSize: '0.85rem', color: '#6c757d' }}>{selectedCustomer.id}</span>
                </div>
              </CustomerInfoBox>

              <h4 style={{ fontSize: '1.05rem', color: 'var(--brand-red, #c62828)', marginBottom: '12px', fontWeight: 700 }}>
                Ordered Fireworks ({selectedCustomer.itemsCount} Items)
              </h4>

              <OrderItemsTable>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th style={{ textAlign: 'center' }}>Price</th>
                    <th style={{ textAlign: 'center' }}>Qty</th>
                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedCustomer.cartItems || []).map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600, color: '#212529' }}>
                        {item.name}
                      </td>
                      <td style={{ textAlign: 'center', color: '#6c757d' }}>
                        ₹{item.price}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#1976d2' }}>
                        {item.quantity}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--brand-red, #c62828)' }}>
                        ₹{item.totalItemPrice || (item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </OrderItemsTable>

              <div style={{
                background: '#ffebee',
                border: '1px solid #ffcdd2',
                borderRadius: '10px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#868e96', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                    TOTAL ORDER AMOUNT
                  </span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-red, #c62828)' }}>
                    ₹{selectedCustomer.totalAmount}
                  </span>
                </div>

                <a 
                  href={`https://wa.me/91${selectedCustomer.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(selectedCustomer.name)}!%20Thank%20you%20for%20your%20order%20at%20Kalishwari%20Crackers.%20Order%20ID:%20${selectedCustomer.id}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: '#25D366',
                    color: '#ffffff',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none'
                  }}
                >
                  <MessageCircle size={16} /> Contact on WhatsApp
                </a>
              </div>
            </ModalCard>
          </ModalBackdrop>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingCustomerId && (
          <ModalBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeletingCustomerId(null)}
          >
            <ModalCard
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '400px', textAlign: 'center', padding: '28px 24px' }}
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
                Delete Customer Record?
              </h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '0.88rem', color: '#6c757d', lineHeight: '1.5' }}>
                Are you sure you want to remove this WhatsApp order record from your admin dashboard?
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
            </ModalCard>
          </ModalBackdrop>
        )}
      </AnimatePresence>

      {/* Animated Green Checkmark Notification */}
      <AnimatedNotification notification={notification} onClose={() => setNotification(null)} />
    </AdminLayout>
  );
};

export default AdminCustomers;
