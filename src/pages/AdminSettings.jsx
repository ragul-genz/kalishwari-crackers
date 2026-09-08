import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Key, Megaphone, Phone, MapPin, Save, RefreshCw, Shield, Store, Eye, EyeOff 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { isAdminAuthenticated } from '../utils/authManager';
import { getStoredSettings, saveStoredSettings, updateAdminCredentials, DEFAULT_SETTINGS } from '../utils/settingsManager';

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

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const [settings, setSettings] = useState(getStoredSettings());
  const [notification, setNotification] = useState(null);

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

  useEffect(() => {
    const handleUpdate = () => {
      const updated = getStoredSettings();
      setSettings(updated);
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

  return (
    <AdminLayout title="Settings">
      <AnimatedNotification notification={notification} onClose={() => setNotification(null)} />

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

        {/* 2. Security & Credentials */}
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

        {/* 3. Customer Top Running Ad Marquee Banner */}
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

        {/* 4. Store Contact Details & Address */}
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
    </AdminLayout>
  );
};

export default AdminSettings;
