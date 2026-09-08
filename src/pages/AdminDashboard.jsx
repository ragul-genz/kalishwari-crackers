import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { isAdminAuthenticated } from '../utils/authManager';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  return (
    <AdminLayout title="Dashboard">
      <div style={{ background: '#ffffff', padding: '28px 28px 24px 28px', borderRadius: '12px', border: '1px solid #e9ecef', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <h3 style={{ color: 'var(--brand-red, #c62828)', marginBottom: '18px', fontSize: '1.35rem', fontFamily: "var(--font-serif, 'Cinzel', serif)", fontWeight: 700 }}>Dashboard Overview</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', border: '1px solid #e9ecef' }}>
            <p style={{ color: '#6c757d', fontSize: '0.85rem', fontWeight: '500' }}>Total Revenue</p>
            <h2 style={{ color: '#212529', fontSize: '1.6rem', marginTop: '6px' }}>₹1,45,800</h2>
          </div>
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', border: '1px solid #e9ecef' }}>
            <p style={{ color: '#6c757d', fontSize: '0.85rem', fontWeight: '500' }}>Total Orders</p>
            <h2 style={{ color: '#212529', fontSize: '1.6rem', marginTop: '6px' }}>124</h2>
          </div>
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', border: '1px solid #e9ecef' }}>
            <p style={{ color: '#6c757d', fontSize: '0.85rem', fontWeight: '500' }}>Active Products</p>
            <h2 style={{ color: '#212529', fontSize: '1.6rem', marginTop: '6px' }}>89</h2>
          </div>
        </div>

        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', border: '1px solid #e9ecef' }}>
          <h4 style={{ color: 'var(--brand-red, #c62828)', marginBottom: '8px' }}>Recent Sales Activity</h4>
          <p style={{ color: '#495057', fontSize: '0.9rem' }}>System performance is optimal. 12 new orders received today.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
