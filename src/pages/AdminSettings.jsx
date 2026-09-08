import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Key, Megaphone, Phone, MapPin, Save, RefreshCw, Shield, Store, Eye, EyeOff,
  FileText, Download, Trash2, RotateCcw, CheckCircle, FileSpreadsheet
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { isAdminAuthenticated } from '../utils/authManager';
import { 
  getStoredSettings, saveStoredSettings, updateAdminCredentials, resetAllStoreData, DEFAULT_SETTINGS 
} from '../utils/settingsManager';

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 18px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const SettingsCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 12px 10px;
    border-radius: 10px;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f1f3f5;

    @media (max-width: 600px) {
      gap: 8px;
      margin-bottom: 12px;
      padding-bottom: 8px;
    }

    .icon-wrapper {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      background: rgba(198, 40, 40, 0.08);
      color: var(--brand-red, #c62828);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      @media (max-width: 600px) {
        width: 32px;
        height: 32px;
        border-radius: 6px;
        svg {
          width: 16px;
          height: 16px;
        }
      }
    }

    h3 {
      font-size: 1.05rem;
      font-family: var(--font-serif, 'Cinzel', serif);
      font-weight: 700;
      color: #212529;
      margin: 0;

      @media (max-width: 600px) {
        font-size: 0.92rem;
      }
    }
    p {
      font-size: 0.78rem;
      color: #6c757d;
      margin: 2px 0 0 0;

      @media (max-width: 600px) {
        font-size: 0.72rem;
      }
    }
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 12px;

  @media (max-width: 600px) {
    margin-bottom: 10px;
    gap: 4px;
  }

  label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #495057;

    @media (max-width: 600px) {
      font-size: 0.75rem;
    }
  }

  input, textarea {
    width: 100%;
    padding: 8px 12px;
    background: #f8f9fa;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 0.88rem;
    color: #212529;
    outline: none;
    transition: all 0.2s ease;
    box-sizing: border-box;

    @media (max-width: 600px) {
      padding: 7px 10px;
      font-size: 0.8rem;
      border-radius: 6px;
    }

    &:focus {
      border-color: var(--brand-red, #c62828);
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(198, 40, 40, 0.1);
    }
  }

  textarea {
    resize: vertical;
    min-height: 70px;
  }
`;

const TwoColResponsiveGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  width: 100%;

  input {
    padding-right: 38px !important;
  }

  .toggle-eye {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;
    cursor: pointer;
    background: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    border-radius: 4px;
    transition: color 0.2s ease;

    &:hover {
      color: var(--brand-red, #c62828);
    }
  }
`;

const SaveButton = styled(motion.button)`
  background: linear-gradient(135deg, var(--brand-red, #c62828), var(--brand-red-dark, #8e0000));
  color: #ffffff;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(198, 40, 40, 0.2);
  margin-top: 6px;
  align-self: flex-start;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #d32f2f, var(--brand-red, #c62828));
    transform: translateY(-1px);
  }

  @media (max-width: 600px) {
    width: 100%;
    padding: 8px 12px;
    font-size: 0.8rem;
  }
`;

const LogoPreviewWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;

  img {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--brand-red, #c62828);
    background: #000;
  }
`;

const NotificationBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const NotificationBoxCard = styled(motion.div)`
  width: 100%;
  max-width: 380px;
  background: #ffffff;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const SVGPathDrawingCheckmark = () => (
  <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
    <motion.svg width="64" height="64" viewBox="0 0 64 64" initial="hidden" animate="visible" style={{ overflow: 'visible' }}>
      <motion.circle
        cx="32" cy="32" r="27" fill="#e8f5e9"
        variants={{
          hidden: { scale: 0, opacity: 0 },
          visible: { scale: [0, 1.1, 1], opacity: 1, transition: { delay: 0.6, duration: 0.4 } }
        }}
      />
      <motion.circle
        cx="32" cy="32" r="27" fill="none" stroke="#2e7d32" strokeWidth="3.5" strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 1, transition: { pathLength: { duration: 0.65 } } }
        }}
      />
      <motion.path
        d="M20 33 L28 41 L44 23" fill="none" stroke="#2e7d32" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 1, transition: { delay: 0.55, pathLength: { duration: 0.45 } } }
        }}
      />
    </motion.svg>
  </div>
);

const AnimatedNotification = ({ notification, onClose }) => {
  if (!notification) return null;
  return (
    <AnimatePresence>
      <NotificationBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <NotificationBoxCard
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 450, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
        >
          <SVGPathDrawingCheckmark />
          <h3 style={{ fontFamily: "var(--font-serif, 'Cinzel', serif)", fontSize: '1.2rem', fontWeight: '700', color: '#212529', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
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

const AdminSettings = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const priceListInputRef = useRef(null);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const [settings, setSettings] = useState(getStoredSettings());
  const [notification, setNotification] = useState(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  // Form State
  const [shopName, setShopName] = useState(settings.shopName || '');
  const [logo, setLogo] = useState(settings.logo || '');
  const [adminUsername, setAdminUsername] = useState(settings.adminUsername || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [adBannerText, setAdBannerText] = useState(settings.adBannerText || '');
  const [phone, setPhone] = useState(settings.phone || '');
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp || '');
  const [email, setEmail] = useState(settings.email || '');
  const [address, setAddress] = useState(settings.address || '');

  // Pricelist state
  const [priceList, setPriceList] = useState(settings.priceList || '');
  const [priceListName, setPriceListName] = useState(settings.priceListName || '');
  const [customPriceListUrl, setCustomPriceListUrl] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      const updated = getStoredSettings();
      setSettings(updated);
      setPriceList(updated.priceList || '');
      setPriceListName(updated.priceListName || '');
    };
    window.addEventListener('settingsUpdated', handleUpdate);
    return () => window.removeEventListener('settingsUpdated', handleUpdate);
  }, []);

  const triggerNotify = (title, message) => {
    setNotification({ id: Date.now(), title, message });
    setTimeout(() => {
      setNotification(null);
    }, 1700);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error('Image size should be less than 4MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
        toast.success('Logo uploaded successfully! Click save to apply.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBranding = (e) => {
    e.preventDefault();
    if (!shopName.trim()) {
      toast.error('Shop Name is required');
      return;
    }
    saveStoredSettings({ shopName: shopName.trim(), logo });
    triggerNotify('Branding Updated', 'Logo & Shop Name updated across all Customer & Admin pages!');
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (!adminUsername.trim()) {
      toast.error('Admin username cannot be empty');
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New Password and Confirm Password do not match');
      return;
    }
    const updatePayload = { adminUsername: adminUsername.trim() };
    if (newPassword) {
      updatePayload.adminPassword = newPassword;
    }
    saveStoredSettings(updatePayload);
    setNewPassword('');
    setConfirmPassword('');
    triggerNotify('Security Updated', 'Admin Username & Password updated! Use new credentials to login.');
  };

  const handleSaveBanner = (e) => {
    e.preventDefault();
    if (!adBannerText.trim()) {
      toast.error('Ad Banner text cannot be empty');
      return;
    }
    saveStoredSettings({ adBannerText: adBannerText.trim() });
    triggerNotify('Banner Updated', 'Customer Portal Top Running Marquee Banner updated!');
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    saveStoredSettings({
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      address: address.trim()
    });
    triggerNotify('Contact Info Saved', 'Store Phone, Email, WhatsApp & Address updated!');
  };

  const handlePriceListFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        toast.error('File size should be less than 15MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPriceList(reader.result);
        setPriceListName(file.name);
        setCustomPriceListUrl('');
        toast.success(`Selected "${file.name}"! Click Save Pricelist to publish to Portal.`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePriceList = (e) => {
    e.preventDefault();
    if (!priceList && !customPriceListUrl) {
      toast.error('Please upload a pricelist file or enter URL first.');
      return;
    }
    const targetList = customPriceListUrl.trim() || priceList;
    const targetName = priceListName || 'Kalishwari_Crackers_Pricelist.pdf';
    saveStoredSettings({ priceList: targetList, priceListName: targetName });
    triggerNotify('Pricelist Published', 'Price list updated! Customers can now download it directly from the portal header.');
  };

  const handleRemovePriceList = () => {
    setPriceList('');
    setPriceListName('');
    setCustomPriceListUrl('');
    saveStoredSettings({ priceList: '', priceListName: '' });
    toast('Pricelist file removed.');
  };

  const executeResetDashboard = () => {
    resetAllStoreData();
    const updated = getStoredSettings();
    setSettings(updated);
    setShopName(updated.shopName || '');
    setLogo(updated.logo || '');
    setAdminUsername(updated.adminUsername || '');
    setAdBannerText(updated.adBannerText || '');
    setPhone(updated.phone || '');
    setWhatsapp(updated.whatsapp || '');
    setEmail(updated.email || '');
    setAddress(updated.address || '');
    setPriceList('');
    setPriceListName('');
    setConfirmResetOpen(false);
    triggerNotify('Dashboard Reset Complete', 'All store data, products, offers, blogs & settings restored to factory defaults!');
  };

  return (
    <AdminLayout title="Settings">
      <AnimatedNotification notification={notification} onClose={() => setNotification(null)} />

      {/* Top Header Action Bar with Reset Dashboard Data Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px', background: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e9ecef', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--brand-red, #c62828)', fontSize: '1.15rem', fontFamily: "var(--font-serif, 'Cinzel', serif)", fontWeight: 700 }}>
            Store Control & Configuration
          </h3>
          <p style={{ margin: '2px 0 0 0', color: '#6c757d', fontSize: '0.8rem' }}>
            Manage pricelist, branding, credentials, banner and system data
          </p>
        </div>

        <button
          type="button"
          onClick={() => setConfirmResetOpen(true)}
          style={{
            background: '#ffebee',
            color: '#d32f2f',
            border: '1px solid #ffcdd2',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <RotateCcw size={16} /> Reset Dashboard Data
        </button>
      </div>

      <SettingsGrid>
        {/* 1. Store Logo & Branding */}
        <SettingsCard>
          <div>
            <div className="card-header">
              <div className="icon-wrapper">
                <Store size={22} />
              </div>
              <div>
                <h3>Store Identity & Logo</h3>
                <p>Upload brand logo and update shop title</p>
              </div>
            </div>

            <form onSubmit={handleSaveBranding}>
              <FormGroup>
                <label>Shop Name / Brand Title *</label>
                <input 
                  type="text" 
                  value={shopName} 
                  onChange={(e) => setShopName(e.target.value)} 
                  placeholder="e.g. Kalishwari Crackers"
                  required 
                />
              </FormGroup>

              <FormGroup>
                <label>Upload Brand Logo Image</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: '9px 16px',
                      background: '#f8f9fa',
                      border: '1px solid #ced4da',
                      borderRadius: '6px',
                      fontSize: '0.86rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <Upload size={16} /> Choose Logo File
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLogo(DEFAULT_SETTINGS.logo);
                      toast('Reset to default logo');
                    }}
                    style={{
                      padding: '9px 12px',
                      background: '#e9ecef',
                      border: '1px solid #ced4da',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    <RefreshCw size={14} /> Reset
                  </button>
                </div>

                {logo && (
                  <LogoPreviewWrapper>
                    <img src={logo} alt="Logo Preview" />
                    <span style={{ fontSize: '0.82rem', color: '#6c757d' }}>Current Logo Preview</span>
                  </LogoPreviewWrapper>
                )}
              </FormGroup>

              <SaveButton whileTap={{ scale: 0.96 }} type="submit">
                <Save size={16} /> Save Branding
              </SaveButton>
            </form>
          </div>
        </SettingsCard>

        {/* 2. Downloadable Price List Card */}
        <SettingsCard>
          <div>
            <div className="card-header">
              <div className="icon-wrapper" style={{ background: '#e3f2fd', color: '#1976d2' }}>
                <FileText size={22} />
              </div>
              <div>
                <h3>Price List PDF / Image</h3>
                <p>Upload catalog or price list file for customer portal download</p>
              </div>
            </div>

            <form onSubmit={handleSavePriceList}>
              <FormGroup>
                <label>Upload Pricelist File (PDF or Image)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => priceListInputRef.current?.click()}
                    style={{
                      padding: '9px 16px',
                      background: '#f8f9fa',
                      border: '1px solid #ced4da',
                      borderRadius: '6px',
                      fontSize: '0.86rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <Upload size={16} /> Select PDF / Image File
                  </button>
                  <input
                    type="file"
                    ref={priceListInputRef}
                    style={{ display: 'none' }}
                    accept=".pdf,image/*"
                    onChange={handlePriceListFileUpload}
                  />
                </div>

                {priceListName && (
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px', background: '#e8f5e9', padding: '8px 12px', borderRadius: '6px', border: '1px solid #c8e6c9' }}>
                    <FileText size={18} color="#2e7d32" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: '0.82rem', color: '#2e7d32', fontWeight: '700', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {priceListName}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#4caf50' }}>Ready for Customer Portal Header</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePriceList}
                      title="Remove Pricelist"
                      style={{ background: 'transparent', color: '#d32f2f', padding: '2px', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </FormGroup>

              <FormGroup>
                <label>Or Enter Direct Pricelist URL (Optional)</label>
                <input 
                  type="url" 
                  value={customPriceListUrl} 
                  onChange={(e) => {
                    setCustomPriceListUrl(e.target.value);
                    if (e.target.value) {
                      setPriceList(e.target.value);
                      setPriceListName('Online_Price_List.pdf');
                    }
                  }} 
                  placeholder="https://example.com/pricelist.pdf"
                />
              </FormGroup>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginTop: '10px' }}>
                <SaveButton whileTap={{ scale: 0.96 }} type="submit">
                  <Save size={16} /> Save Pricelist
                </SaveButton>

                {priceList && (
                  <a
                    href={priceList}
                    target="_blank"
                    rel="noreferrer"
                    download={priceListName || "Kalishwari_Crackers_Pricelist"}
                    style={{
                      padding: '8px 14px',
                      background: '#e3f2fd',
                      color: '#1976d2',
                      border: '1px solid #bbdefb',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      textDecoration: 'none',
                      marginTop: '6px'
                    }}
                  >
                    <Download size={15} /> Test Download
                  </a>
                )}
              </div>
            </form>
          </div>
        </SettingsCard>

        {/* 3. Security & Credentials */}
        <SettingsCard>
          <div>
            <div className="card-header">
              <div className="icon-wrapper">
                <Shield size={22} />
              </div>
              <div>
                <h3>Admin Credentials</h3>
                <p>Change admin User ID and Login Password</p>
              </div>
            </div>

            <form onSubmit={handleSaveSecurity}>
              <FormGroup>
                <label>Admin User ID / Username *</label>
                <input 
                  type="text" 
                  value={adminUsername} 
                  onChange={(e) => setAdminUsername(e.target.value)} 
                  placeholder="Enter admin username"
                  required 
                />
              </FormGroup>

              <FormGroup>
                <label>New Password (Leave blank to keep unchanged)</label>
                <PasswordInputWrapper>
                  <input 
                    type={showNewPassword ? 'text' : 'password'} 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="toggle-eye"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    title={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </PasswordInputWrapper>
              </FormGroup>

              {newPassword && (
                <FormGroup>
                  <label>Confirm New Password</label>
                  <PasswordInputWrapper>
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-eye"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </PasswordInputWrapper>
                </FormGroup>
              )}

              <SaveButton whileTap={{ scale: 0.96 }} type="submit">
                <Key size={16} /> Update Credentials
              </SaveButton>
            </form>
          </div>
        </SettingsCard>

        {/* 4. Customer Top Running Ad Marquee Banner */}
        <SettingsCard>
          <div>
            <div className="card-header">
              <div className="icon-wrapper">
                <Megaphone size={22} />
              </div>
              <div>
                <h3>Header Ad Marquee Banner</h3>
                <p>Edit top running promotional text in Customer Portal</p>
              </div>
            </div>

            <form onSubmit={handleSaveBanner}>
              <FormGroup>
                <label>Running Announcement Text *</label>
                <textarea 
                  rows={3} 
                  value={adBannerText} 
                  onChange={(e) => setAdBannerText(e.target.value)} 
                  placeholder="Enter promo text displayed at the top of shop pages..."
                  required 
                />
              </FormGroup>

              <SaveButton whileTap={{ scale: 0.96 }} type="submit">
                <Save size={16} /> Save Banner Text
              </SaveButton>
            </form>
          </div>
        </SettingsCard>

        {/* 5. Store Contact Details & Address */}
        <SettingsCard>
          <div>
            <div className="card-header">
              <div className="icon-wrapper">
                <Phone size={22} />
              </div>
              <div>
                <h3>Contact & Location Info</h3>
                <p>Update phone, email, WhatsApp & store location address</p>
              </div>
            </div>

            <form onSubmit={handleSaveContact}>
              <TwoColResponsiveGroup>
                <FormGroup>
                  <label>Phone Number</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="+91 98765 43210" 
                  />
                </FormGroup>

                <FormGroup>
                  <label>WhatsApp Number</label>
                  <input 
                    type="text" 
                    value={whatsapp} 
                    onChange={(e) => setWhatsapp(e.target.value)} 
                    placeholder="+91 98765 43210" 
                  />
                </FormGroup>
              </TwoColResponsiveGroup>

              <FormGroup>
                <label>Support Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="info@kalishwaricrackers.com" 
                />
              </FormGroup>

              <FormGroup>
                <label>Store Address & Location</label>
                <textarea 
                  rows={3} 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="Enter full store street address and location..." 
                />
              </FormGroup>

              <SaveButton whileTap={{ scale: 0.96 }} type="submit">
                <MapPin size={16} /> Save Contact & Address
              </SaveButton>
            </form>
          </div>
        </SettingsCard>
      </SettingsGrid>

      {/* Confirm Reset All Store Data Modal */}
      <AnimatePresence>
        {confirmResetOpen && (
          <NotificationBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmResetOpen(false)}>
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '420px', width: '90%', textAlign: 'center', padding: '28px 24px' }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#ffebee',
                border: '1px solid #ffcdd2',
                display: 'flex',
                alignItems: 'center',
                justify-content: 'center',
                margin: '0 auto 16px auto'
              }}>
                <RotateCcw size={26} color="#d32f2f" />
              </div>

              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#212529' }}>
                Reset All Dashboard Data?
              </h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '0.88rem', color: '#6c757d', lineHeight: '1.5' }}>
                Are you sure you want to reset all store products, categories, offers, blogs, customer orders & settings back to factory defaults?
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setConfirmResetOpen(false)}
                  style={{ padding: '9px 18px', borderRadius: '8px', background: '#e9ecef', color: '#495057', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeResetDashboard}
                  style={{ padding: '9px 18px', borderRadius: '8px', background: '#d32f2f', color: '#ffffff', fontWeight: 600 }}
                >
                  Yes, Reset All
                </button>
              </div>
            </div>
          </NotificationBackdrop>
        )}
      </AnimatePresence>
  );
};

export default AdminSettings;
