import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Users, Search, Mail, Phone, ShoppingBag, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { isAdminAuthenticated } from '../utils/authManager';

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
  margin-bottom: 8px;
`;

const StatCard = styled.div`
  background: #f8f9fa;
  padding: 18px 20px;
  border-radius: 10px;
  border: 1px solid #e9ecef;

  p {
    color: #6c757d;
    font-size: 0.84rem;
    font-weight: 600;
  }

  h2 {
    color: #212529;
    font-size: 1.5rem;
    margin-top: 4px;
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

const MOCK_CUSTOMERS = [
  { id: 'CUST-101', name: 'Ramesh Kumar', phone: '+91 98765 43210', email: 'ramesh@gmail.com', city: 'Madurai', ordersCount: 4, totalSpent: '₹14,500', joinedDate: '2026-08-12' },
  { id: 'CUST-102', name: 'Priya Sundaram', phone: '+91 94433 12345', email: 'priya.s@yahoo.com', city: 'Chennai', ordersCount: 2, totalSpent: '₹8,200', joinedDate: '2026-08-20' },
  { id: 'CUST-103', name: 'Karthik Raja', phone: '+91 97890 56789', email: 'karthik@hotmail.com', city: 'Coimbatore', ordersCount: 5, totalSpent: '₹22,900', joinedDate: '2026-08-28' },
  { id: 'CUST-104', name: 'Anitha Vijay', phone: '+91 98421 87654', email: 'anitha.v@gmail.com', city: 'Sivakasi', ordersCount: 1, totalSpent: '₹3,400', joinedDate: '2026-09-02' },
  { id: 'CUST-105', name: 'Senthil Nathan', phone: '+91 99944 33221', email: 'senthil.n@gmail.com', city: 'Trichy', ordersCount: 3, totalSpent: '₹11,800', joinedDate: '2026-09-05' },
];

const AdminCustomers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Customers">
      <div style={{ background: '#ffffff', padding: '28px 28px 24px 28px', borderRadius: '12px', border: '1px solid #e9ecef', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ color: 'var(--brand-red, #c62828)', fontSize: '1.35rem', fontFamily: "var(--font-serif, 'Cinzel', serif)", fontWeight: 700 }}>Customer Directory & Accounts</h3>
            <p style={{ color: '#6c757d', fontSize: '0.82rem', marginTop: '2px' }}>Overview of registered buyers, contact details & purchase activity</p>
          </div>

          <SearchContainer>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by name, phone, email, city..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
        </div>

        <StatsGrid>
          <StatCard>
            <p>Total Customers</p>
            <h2>142 Registered</h2>
          </StatCard>
          <StatCard>
            <p>Repeat Buyers</p>
            <h2>68% Rate</h2>
          </StatCard>
          <StatCard>
            <p>Average Order Value</p>
            <h2>₹4,850</h2>
          </StatCard>
        </StatsGrid>

        <PageContainer>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem', minWidth: '650px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e9ecef', color: 'var(--brand-red, #c62828)', fontWeight: '700' }}>
                  <th style={{ padding: '12px 10px' }}>Customer Name</th>
                  <th style={{ padding: '12px 10px' }}>Phone / WhatsApp</th>
                  <th style={{ padding: '12px 10px' }}>Email</th>
                  <th style={{ padding: '12px 10px' }}>City</th>
                  <th style={{ padding: '12px 10px' }}>Orders</th>
                  <th style={{ padding: '12px 10px' }}>Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#6c757d' }}>
                      No customers match search query "{searchTerm}".
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map(customer => (
                    <tr key={customer.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                      <td style={{ padding: '12px 10px', fontWeight: '600', color: '#212529' }}>
                        {customer.name}
                        <div style={{ fontSize: '0.74rem', color: '#868e96', fontWeight: 'normal' }}>ID: {customer.id}</div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#495057' }}>
                          <Phone size={14} style={{ color: '#2e7d32' }} /> {customer.phone}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', color: '#6c757d' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Mail size={14} style={{ color: 'var(--brand-red, #c62828)' }} /> {customer.email}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <span style={{ background: '#f1f3f5', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', color: '#495057', fontWeight: '600' }}>
                          {customer.city}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', fontWeight: '600', color: '#212529' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <ShoppingBag size={14} style={{ color: '#1976d2' }} /> {customer.ordersCount} orders
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', fontWeight: '700', color: 'var(--brand-red, #c62828)' }}>
                        {customer.totalSpent}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </PageContainer>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
