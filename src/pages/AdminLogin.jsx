import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo.jpg';
import sparklersBg from '../assets/images/sparklers.webp';
import { isAdminAuthenticated, setAdminAuthenticated } from '../utils/authManager';
import { getStoredSettings, verifyAdminCredentials } from '../utils/settingsManager';

const PageContainer = styled.div`
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, rgba(20, 10, 10, 0.92) 0%, rgba(40, 15, 20, 0.95) 100%), url(${sparklersBg});
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;

  @media (max-width: 600px) {
    height: 100vh;
    height: 100dvh;
    max-height: 100dvh;
    padding: 48px 14px 14px;
  }
`;

const BackToStoreBtn = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--gold-light, #F3E5AB);
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(212, 175, 55, 0.3);
  padding: 7px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
  z-index: 10;
  cursor: pointer;

  &:hover {
    background: rgba(212, 175, 55, 0.2);
    border-color: var(--gold-primary, #D4AF37);
    color: #ffffff;
    transform: translateX(-3px);
  }

  @media (max-width: 600px) {
    top: 10px;
    left: 12px;
    padding: 5px 10px;
    font-size: 0.75rem;
  }
`;

const LoginCardWrapper = styled(motion.div)`
  width: 100%;
  max-width: 380px;
  background: rgba(18, 18, 18, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(212, 175, 55, 0.35);
  border-radius: 14px;
  padding: 28px 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(198, 40, 40, 0.15);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--gold-light, #F3E5AB), var(--brand-red, #c62828), var(--gold-primary, #D4AF37));
  }

  @media (max-width: 600px) {
    padding: 16px 14px;
    max-width: 100%;
    border-radius: 12px;
  }
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 18px;

  @media (max-width: 600px) {
    margin-bottom: 10px;
  }

  img {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--gold-primary, #D4AF37);
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
    margin-bottom: 8px;

    @media (max-width: 600px) {
      width: 44px;
      height: 44px;
      margin-bottom: 4px;
    }
  }

  h1 {
    font-family: var(--font-serif, 'Cinzel', serif);
    font-size: 1.35rem;
    color: #ffffff;
    margin-bottom: 3px;
    letter-spacing: 1px;

    @media (max-width: 600px) {
      font-size: 1.1rem;
      margin-bottom: 2px;
    }
  }

  .admin-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, rgba(198, 40, 40, 0.3), rgba(170, 130, 34, 0.3));
    border: 1px solid rgba(212, 175, 55, 0.4);
    color: var(--gold-light, #F3E5AB);
    font-size: 0.7rem;
    padding: 2px 10px;
    border-radius: 12px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: 600;

    @media (max-width: 600px) {
      font-size: 0.65rem;
      padding: 1px 8px;
    }
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 600px) {
    gap: 8px;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    font-size: 0.82rem;
    color: #cccccc;
    font-weight: 500;
  }

  @media (max-width: 600px) {
    gap: 3px;

    label {
      font-size: 0.75rem;
    }
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .input-icon {
    position: absolute;
    left: 12px;
    color: var(--gold-primary, #D4AF37);
  }

  .toggle-icon {
    position: absolute;
    right: 12px;
    color: #888888;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: #ffffff;
    }
  }

  input {
    width: 100%;
    padding: 10px 12px 10px 40px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    color: #ffffff;
    font-size: 0.9rem;
    transition: all 0.3s ease;

    @media (max-width: 600px) {
      padding: 8px 10px 8px 34px;
      font-size: 0.82rem;
    }

    &::placeholder {
      color: #777777;
    }

    &:focus {
      outline: none;
      border-color: var(--gold-primary, #D4AF37);
      background: rgba(255, 255, 255, 0.1);
      box-shadow: 0 0 10px rgba(212, 175, 55, 0.25);
    }
  }

  @media (max-width: 600px) {
    .input-icon {
      left: 10px;
      width: 15px;
      height: 15px;
    }
    .toggle-icon {
      right: 10px;
      width: 15px;
      height: 15px;
    }
  }
`;

const OptionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
  color: #aaaaaa;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    input[type="checkbox"] {
      accent-color: var(--gold-primary, #D4AF37);
    }
  }

  button.forgot-btn {
    color: var(--gold-light, #F3E5AB);
    font-size: 0.82rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      text-decoration: underline;
      opacity: 0.9;
    }
  }

  @media (max-width: 600px) {
    font-size: 0.74rem;

    button.forgot-btn {
      font-size: 0.74rem;
    }
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, var(--brand-red, #c62828), var(--brand-red-dark, #8e0000));
  border: 1px solid var(--gold-primary, #D4AF37);
  color: #ffffff;
  padding: 11px;
  border-radius: 8px;
  font-size: 0.92rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: 4px;
  box-shadow: 0 6px 20px rgba(198, 40, 40, 0.4);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, #d32f2f, var(--brand-red, #c62828));
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    padding: 9px;
    font-size: 0.82rem;
    margin-top: 2px;
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

const NotificationBadge = styled(motion.div)`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SVGPathDrawingCheckmark = () => {
  return (
    <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
      <motion.svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        initial="hidden"
        animate="visible"
        style={{ overflow: 'visible' }}
      >
        <motion.circle
          cx="32"
          cy="32"
          r="27"
          fill="#e8f5e9"
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: { 
              scale: [0, 1.1, 1], 
              opacity: 1,
              transition: { delay: 0.6, duration: 0.4, ease: "easeOut" }
            }
          }}
        />

        <motion.circle
          cx="32"
          cy="32"
          r="27"
          fill="none"
          stroke="#2e7d32"
          strokeWidth="3.5"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { pathLength: { duration: 0.65, ease: "easeInOut" }, opacity: { duration: 0.1 } }
            }
          }}
        />

        <motion.path
          d="M20 33 L28 41 L44 23"
          fill="none"
          stroke="#2e7d32"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { delay: 0.55, pathLength: { duration: 0.45, ease: "easeOut" }, opacity: { delay: 0.55, duration: 0.05 } }
            }
          }}
        />
      </motion.svg>
    </div>
  );
};

const SVGPathDrawingError = () => {
  return (
    <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
      <motion.svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        initial="hidden"
        animate="visible"
        style={{ overflow: 'visible' }}
      >
        <motion.circle
          cx="32"
          cy="32"
          r="27"
          fill="#ffebee"
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: { 
              scale: [0, 1.1, 1], 
              opacity: 1,
              transition: { delay: 0.2, duration: 0.4, ease: "easeOut" }
            }
          }}
        />

        <motion.circle
          cx="32"
          cy="32"
          r="27"
          fill="none"
          stroke="#d32f2f"
          strokeWidth="3.5"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { pathLength: { duration: 0.5, ease: "easeInOut" }, opacity: { duration: 0.1 } }
            }
          }}
        />

        <motion.path
          d="M22 22 L42 42 M42 22 L22 42"
          fill="none"
          stroke="#d32f2f"
          strokeWidth="4"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { delay: 0.4, pathLength: { duration: 0.4, ease: "easeOut" }, opacity: { delay: 0.4, duration: 0.05 } }
            }
          }}
        />
      </motion.svg>
    </div>
  );
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginNotification, setLoginNotification] = useState(null);

  const [storeSettings, setStoreSettings] = useState(getStoredSettings());

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const handleUpdate = () => setStoreSettings(getStoredSettings());
    window.addEventListener('settingsUpdated', handleUpdate);
    return () => window.removeEventListener('settingsUpdated', handleUpdate);
  }, []);

  const triggerLoginNotify = (title, message, isError = false) => {
    setLoginNotification({ id: Date.now(), title, message, isError });
    setTimeout(() => {
      setLoginNotification(null);
    }, isError ? 2200 : 1500);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      triggerLoginNotify('Login Error', 'Please enter both User ID and Password', true);
      return;
    }

    if (!verifyAdminCredentials(username.trim(), password.trim())) {
      triggerLoginNotify('Invalid Credentials', 'Incorrect User ID or Password! Please check and try again.', true);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setAdminAuthenticated(true);
      triggerLoginNotify('Login Successful', 'Welcome back, Admin! Access granted', false);
      setTimeout(() => {
        const destination = location.state?.from?.pathname || '/admin/dashboard';
        navigate(destination, { replace: true });
      }, 1500);
    }, 400);
  };

  return (
    <PageContainer>
      <AnimatePresence>
        {loginNotification && (
          <NotificationBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLoginNotification(null)}
          >
            <NotificationBoxCard
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 450, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              {loginNotification.isError ? <SVGPathDrawingError /> : <SVGPathDrawingCheckmark />}
              <h3 style={{
                fontFamily: "var(--font-serif, 'Cinzel', serif)",
                fontSize: '1.2rem',
                fontWeight: '700',
                color: loginNotification.isError ? '#d32f2f' : '#212529',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                margin: '0 0 8px 0'
              }}>
                {loginNotification.title}
              </h3>
              <p style={{
                fontSize: '0.9rem',
                color: '#6c757d',
                lineHeight: '1.5',
                margin: 0
              }}>
                {loginNotification.message}
              </p>
            </NotificationBoxCard>
          </NotificationBackdrop>
        )}
      </AnimatePresence>

      <BackToStoreBtn onClick={() => navigate('/')}>
        <ArrowLeft size={16} /> Return to Store
      </BackToStoreBtn>

      <LoginCardWrapper
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <LogoContainer>
          <img src={storeSettings.logo} alt={storeSettings.shopName} />
          <h1>{storeSettings.shopName}</h1>
          <div className="admin-badge">
            <ShieldCheck size={14} /> Admin Portal
          </div>
        </LogoContainer>

        <StyledForm onSubmit={handleLogin}>
          <InputGroup>
            <label htmlFor="admin-username">Username / Email</label>
            <InputWrapper>
              <User className="input-icon" size={18} />
              <input
                id="admin-username"
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </InputWrapper>
          </InputGroup>

          <InputGroup>
            <label htmlFor="admin-password">Password</label>
            <InputWrapper>
              <Lock className="input-icon" size={18} />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <div className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </InputWrapper>
          </InputGroup>

          <OptionsRow>
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember session
            </label>
          </OptionsRow>

          <SubmitButton
            type="submit"
            disabled={isLoading}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </SubmitButton>
        </StyledForm>

      </LoginCardWrapper>
    </PageContainer>
  );
};

export default AdminLogin;
