import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit2, Trash2, Eye, Tag, Calendar, 
  CheckCircle2, X, Upload, Copy, Sparkles, AlertCircle
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { isAdminAuthenticated } from '../utils/authManager';
import { 
  getStoredOffers, getOffersAsync, addOffer, updateOffer, deleteOffer, PRESET_OFFER_IMAGES 
} from '../utils/offerManager';

const HeaderActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 14px;
    gap: 10px;
  }
`;

const HeaderControls = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    width: 100%;
    gap: 8px;
  }
`;

const PageTitle = styled.h2`
  font-size: 1.5rem;
  font-family: var(--font-serif, 'Cinzel', serif);
  color: var(--brand-red, #c62828);
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 600px) {
    font-size: 1.05rem;
    gap: 8px;
  }

  span {
    font-size: 0.78rem;
    background: #ffebee;
    color: var(--brand-red, #c62828);
    padding: 2px 8px;
    border-radius: 20px;
    font-family: var(--font-sans, sans-serif);
    font-weight: 600;
  }
`;

const AddBtn = styled.button`
  background: linear-gradient(135deg, var(--brand-red, #c62828), var(--brand-red-dark, #8e0000));
  color: #ffffff;
  padding: 9px 18px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.88rem;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(198, 40, 40, 0.25);
  transition: all 0.2s ease;
  white-space: nowrap;

  @media (max-width: 600px) {
    padding: 7px 12px;
    font-size: 0.78rem;
    border-radius: 6px;
    justify-content: center;
    flex-shrink: 0;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(198, 40, 40, 0.35);
  }
`;

const SearchBox = styled.div`
  position: relative;
  max-width: 320px;
  width: 100%;
  flex: 1;
  min-width: 160px;

  @media (max-width: 600px) {
    max-width: 100%;
    min-width: 0;
  }

  input {
    width: 100%;
    padding: 8px 12px 8px 34px;
    border-radius: 8px;
    border: 1px solid #ced4da;
    font-size: 0.88rem;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;

    @media (max-width: 600px) {
      font-size: 0.8rem;
      padding: 7px 10px 7px 30px;
      border-radius: 6px;
    }

    &:focus {
      border-color: var(--gold-primary, #D4AF37);
      box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
    }
  }

  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;

    @media (max-width: 600px) {
      width: 15px;
      height: 15px;
      left: 8px;
    }
  }
`;

const OffersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const OfferCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    border-color: rgba(212, 175, 55, 0.4);
  }

  @media (max-width: 600px) {
    border-radius: 10px;
  }
`;

const OfferImageWrapper = styled.div`
  position: relative;
  height: 160px;
  width: 100%;
  background: #f8f9fa;

  @media (max-width: 600px) {
    height: 130px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .discount-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: linear-gradient(135deg, #d32f2f, #b71c1c);
    color: #ffffff;
    font-weight: 800;
    font-size: 0.78rem;
    padding: 4px 10px;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    letter-spacing: 0.5px;
    text-transform: uppercase;

    @media (max-width: 600px) {
      font-size: 0.7rem;
      padding: 3px 8px;
      top: 8px;
      left: 8px;
    }
  }

  .status-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    font-weight: 600;
    font-size: 0.72rem;
    padding: 3px 8px;
    border-radius: 10px;
    backdrop-filter: blur(4px);

    @media (max-width: 600px) {
      font-size: 0.68rem;
      padding: 2px 6px;
      top: 8px;
      right: 8px;
    }

    &.Active {
      background: rgba(46, 125, 50, 0.9);
      color: #ffffff;
    }
    &.Draft {
      background: rgba(230, 81, 0, 0.9);
      color: #ffffff;
    }
    &.Expired {
      background: rgba(117, 117, 117, 0.9);
      color: #ffffff;
    }
  }
`;

const OfferBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;

  @media (max-width: 600px) {
    padding: 12px;
  }

  .title {
    font-size: 1.05rem;
    font-weight: 700;
    color: #212529;
    margin-bottom: 6px;

    @media (max-width: 600px) {
      font-size: 0.92rem;
    }
  }

  .desc {
    font-size: 0.84rem;
    color: #6c757d;
    line-height: 1.45;
    margin-bottom: 12px;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    @media (max-width: 600px) {
      font-size: 0.76rem;
      margin-bottom: 8px;
    }
  }
`;

const CouponBox = styled.div`
  background: #f8f9fa;
  border: 1px dashed var(--gold-dark, #AA8222);
  border-radius: 8px;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 4px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 5px 8px;
    margin-bottom: 8px;
  }

  .code {
    font-family: monospace;
    font-weight: 700;
    font-size: 0.88rem;
    color: var(--brand-red, #c62828);
    letter-spacing: 0.5px;
    word-break: break-all;

    @media (max-width: 600px) {
      font-size: 0.78rem;
    }
  }

  .validity {
    font-size: 0.72rem;
    color: #6c757d;
    display: flex;
    align-items: center;
    gap: 4px;

    @media (max-width: 600px) {
      font-size: 0.68rem;
    }
  }
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f1f3f5;
  padding-top: 10px;
  flex-wrap: wrap;
  gap: 6px;

  .portal-tag {
    font-size: 0.76rem;
    color: #6c757d;
    display: flex;
    align-items: center;
    gap: 4px;

    @media (max-width: 600px) {
      font-size: 0.7rem;
    }
  }

  .actions {
    display: flex;
    gap: 6px;

    button {
      padding: 6px;
      border-radius: 6px;
      transition: background 0.2s;
      color: #495057;

      @media (max-width: 600px) {
        padding: 4px;
        svg {
          width: 15px;
          height: 15px;
        }
      }

      &:hover {
        background: #e9ecef;
      }

      &.view:hover { color: #1976d2; background: #e3f2fd; }
      &.edit:hover { color: #f57c00; background: #fff3e0; }
      &.delete:hover { color: #d32f2f; background: #ffebee; }
    }
  }
`;

/* Modal Backdrop & Cards */
const ModalBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 20px;
`;

const ModalCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
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

const FormGroup = styled.div`
  margin-bottom: 16px;

  label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: #495057;
    margin-bottom: 6px;
  }

  input, select, textarea {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #ced4da;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: var(--gold-primary, #D4AF37);
      box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
    }
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }
`;

const PresetSelector = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;

  .preset-item {
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 8px;
    overflow: hidden;
    height: 60px;
    width: 100px;
    position: relative;

    &.selected {
      border-color: var(--gold-primary, #D4AF37);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;

  button {
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.2s;
  }

  .cancel-btn {
    background: #e9ecef;
    color: #495057;
    &:hover { background: #dee2e6; }
  }

  .save-btn {
    background: linear-gradient(135deg, var(--brand-red, #c62828), var(--brand-red-dark, #8e0000));
    color: #ffffff;
    &:hover { opacity: 0.95; }
  }
`;

/* Notification Popup Overlay */
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
      <motion.svg
        viewBox="0 0 50 50"
        style={{ width: '100%', height: '100%' }}
      >
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

          <p style={{
            fontSize: '0.9rem',
            color: '#6c757d',
            lineHeight: '1.5',
            margin: 0
          }}>
            {notification.message}
          </p>
        </NotificationBoxCard>
      </NotificationBackdrop>
    </AnimatePresence>
  );
};

const AdminOffers = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [viewingOffer, setViewingOffer] = useState(null);
  const [deletingOfferId, setDeletingOfferId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    discount: '',
    couponCode: '',
    description: '',
    image: PRESET_OFFER_IMAGES[0].url,
    validUntil: '',
    status: 'Active'
  });

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    const loadOffers = async () => {
      const data = await getOffersAsync();
      if (data) setOffers(data);
    };
    loadOffers();

    const handleUpdate = async () => {
      const data = await getOffersAsync();
      if (data) setOffers(data);
    };

    window.addEventListener('offersUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('focus', handleUpdate);
    document.addEventListener('visibilitychange', handleUpdate);
    return () => {
      window.removeEventListener('offersUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
      document.removeEventListener('visibilitychange', handleUpdate);
    };
  }, [navigate]);

  const triggerSuccessNotification = (title, message) => {
    setNotification({ id: Date.now(), title, message });
    setTimeout(() => {
      setNotification(null);
    }, 2200);
  };

  const handleOpenAddModal = () => {
    setEditingOffer(null);
    setFormData({
      title: '',
      discount: '',
      couponCode: '',
      description: '',
      image: PRESET_OFFER_IMAGES[0].url,
      validUntil: '2026-12-31',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title || '',
      discount: offer.discount || '',
      couponCode: offer.couponCode || '',
      description: offer.description || '',
      image: offer.image || PRESET_OFFER_IMAGES[0].url,
      validUntil: offer.validUntil || '',
      status: offer.status || 'Active'
    });
    setIsModalOpen(true);
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.discount) {
      alert('Please fill out Title and Discount Badge.');
      return;
    }

    if (editingOffer) {
      const updatedList = updateOffer(editingOffer.id, formData);
      setOffers(updatedList);
      setIsModalOpen(false);
      triggerSuccessNotification('Offer Updated', 'The offer details have been updated successfully.');
    } else {
      const updatedList = addOffer(formData);
      setOffers(updatedList);
      setIsModalOpen(false);
      triggerSuccessNotification('Offer Added', 'New festival offer added and published to user portal!');
    }
  };

  const confirmDeleteOffer = () => {
    if (deletingOfferId) {
      const updatedList = deleteOffer(deletingOfferId);
      setOffers(updatedList);
      setDeletingOfferId(null);
      triggerSuccessNotification('Offer Deleted', 'The offer has been removed from system.');
    }
  };

  const filteredOffers = offers.filter(o => 
    (o.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.couponCode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.status || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Offers & Discounts">
      <HeaderActions>
        <PageTitle>
          Festival Offers <span>{offers.length} Offers</span>
        </PageTitle>

        <HeaderControls>
          <SearchBox>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search offer, code or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBox>

          <AddBtn onClick={handleOpenAddModal}>
            <Plus size={18} /> Add New Offer
          </AddBtn>
        </HeaderControls>
      </HeaderActions>

      {filteredOffers.length === 0 ? (
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '12px', 
          padding: '48px', 
          textAlign: 'center', 
          border: '1px solid #e9ecef' 
        }}>
          <Sparkles size={48} color="var(--gold-primary, #D4AF37)" style={{ marginBottom: '12px' }} />
          <h3 style={{ color: '#495057', margin: '0 0 8px 0' }}>No Offers Found</h3>
          <p style={{ color: '#868e96', margin: 0 }}>Create a new offer to display it live on the Customer Portal.</p>
        </div>
      ) : (
        <OffersGrid>
          {filteredOffers.map(offer => (
            <OfferCard
              key={offer.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <OfferImageWrapper>
                <img src={offer.image} alt={offer.title} />
                <span className="discount-badge">{offer.discount}</span>
                <span className={`status-badge ${offer.status}`}>{offer.status}</span>
              </OfferImageWrapper>

              <OfferBody>
                <div className="title">{offer.title}</div>
                <div className="desc">{offer.description}</div>

                <CouponBox>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#868e96', display: 'block' }}>COUPON CODE</span>
                    <span className="code" style={{ fontSize: offer.couponCode ? '0.95rem' : '0.82rem', color: offer.couponCode ? 'var(--brand-red, #c62828)' : '#6c757d' }}>
                      {offer.couponCode || 'No Code Needed'}
                    </span>
                  </div>
                  <div className="validity">
                    <Calendar size={13} /> {offer.validUntil}
                  </div>
                </CouponBox>

                <CardFooter>
                  <span style={{ fontSize: '0.8rem', color: '#6c757d', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Tag size={14} color="var(--gold-dark, #AA8222)" /> Live on Portal
                  </span>
                  
                  <div className="actions">
                    <button 
                      className="view" 
                      title="View Details" 
                      onClick={() => setViewingOffer(offer)}
                    >
                      <Eye size={17} />
                    </button>
                    <button 
                      className="edit" 
                      title="Edit Offer" 
                      onClick={() => handleOpenEditModal(offer)}
                    >
                      <Edit2 size={17} />
                    </button>
                    <button 
                      className="delete" 
                      title="Delete Offer" 
                      onClick={() => setDeletingOfferId(offer.id)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </CardFooter>
              </OfferBody>
            </OfferCard>
          ))}
        </OffersGrid>
      )}

      {/* Add / Edit Offer Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <ModalBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <ModalCard
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <h3>{editingOffer ? 'Edit Festival Offer' : 'Add New Offer'}</h3>
                <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
              </ModalHeader>

              <form onSubmit={handleSubmitForm}>
                <FormGroup>
                  <label>Offer Title *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Diwali Mega Sale (80% Off)"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </FormGroup>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <FormGroup>
                    <label>Discount Badge *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 80% OFF, FREE DELIVERY"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Coupon Code (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. DIWALI80 (Optional)"
                      value={formData.couponCode}
                      onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                    />
                  </FormGroup>
                </div>

                <FormGroup>
                  <label>Description</label>
                  <textarea 
                    placeholder="Brief description of the offer for user portal..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </FormGroup>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <FormGroup>
                    <label>Valid Until</label>
                    <input 
                      type="date" 
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </FormGroup>
                </div>

                <FormGroup>
                  <label>Offer Image Preview</label>
                  {/* Live Image Preview Box */}
                  <div style={{
                    width: '100%',
                    height: '150px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '2px dashed var(--gold-primary, #D4AF37)',
                    marginBottom: '12px',
                    background: '#f8f9fa',
                    position: 'relative',
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.04)'
                  }}>
                    {formData.image ? (
                      <>
                        <img 
                          src={formData.image} 
                          alt="Offer Banner Preview" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <span style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'rgba(0, 0, 0, 0.75)',
                          color: '#ffffff',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backdropFilter: 'blur(4px)'
                        }}>
                          Live Preview
                        </span>
                      </>
                    ) : (
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        height: '100%', 
                        color: '#868e96', 
                        fontSize: '0.85rem',
                        gap: '6px'
                      }}>
                        <Upload size={24} color="#adb5bd" />
                        <span>No image selected for preview</span>
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#6c757d', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      Choose Preset Image:
                    </span>
                    <PresetSelector>
                      {PRESET_OFFER_IMAGES.map((preset, idx) => (
                        <div 
                          key={idx}
                          className={`preset-item ${formData.image === preset.url ? 'selected' : ''}`}
                          onClick={() => setFormData({ ...formData, image: preset.url })}
                          title={preset.name}
                        >
                          <img src={preset.url} alt={preset.name} />
                        </div>
                      ))}
                    </PresetSelector>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#6c757d', fontWeight: 600 }}>
                      Or Upload Custom Image / Enter URL:
                    </span>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="offer-img-upload" 
                        style={{ display: 'none' }}
                        onChange={handleImageFileUpload}
                      />
                      <label 
                        htmlFor="offer-img-upload"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '9px 14px',
                          background: '#f1f3f5',
                          border: '1px solid #ced4da',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          margin: 0,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Upload size={16} /> Choose File...
                      </label>
                      <input 
                        type="text"
                        placeholder="Paste image URL (optional)"
                        value={formData.image && !formData.image.startsWith('data:') ? formData.image : ''}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        style={{ fontSize: '0.85rem', padding: '8px 10px' }}
                      />
                    </div>
                  </div>
                </FormGroup>

                <ModalActions>
                  <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    {editingOffer ? 'Save Changes' : 'Create Offer'}
                  </button>
                </ModalActions>
              </form>
            </ModalCard>
          </ModalBackdrop>
        )}
      </AnimatePresence>

      {/* View Offer Details Modal */}
      <AnimatePresence>
        {viewingOffer && (
          <ModalBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewingOffer(null)}
          >
            <ModalCard
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <h3>Offer Preview</h3>
                <button onClick={() => setViewingOffer(null)}><X size={20} /></button>
              </ModalHeader>

              <div style={{ borderRadius: '8px', overflow: 'hidden', height: '180px', marginBottom: '16px' }}>
                <img src={viewingOffer.image} alt={viewingOffer.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <h4 style={{ fontSize: '1.25rem', color: 'var(--brand-red, #c62828)', marginBottom: '8px' }}>
                {viewingOffer.title}
              </h4>
              <p style={{ color: '#495057', fontSize: '0.92rem', marginBottom: '16px', lineHeight: '1.6' }}>
                {viewingOffer.description}
              </p>

              <CouponBox>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#868e96', display: 'block' }}>COUPON CODE</span>
                  <span className="code" style={{ fontSize: viewingOffer.couponCode ? '0.95rem' : '0.82rem', color: viewingOffer.couponCode ? 'var(--brand-red, #c62828)' : '#6c757d' }}>
                    {viewingOffer.couponCode || 'No Code Needed'}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: '#868e96', display: 'block' }}>DISCOUNT</span>
                  <span style={{ fontWeight: '700', color: 'var(--gold-dark, #AA8222)' }}>{viewingOffer.discount}</span>
                </div>
              </CouponBox>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6c757d' }}>
                <span>Status: <strong>{viewingOffer.status}</strong></span>
                <span>Valid Until: <strong>{viewingOffer.validUntil}</strong></span>
              </div>
            </ModalCard>
          </ModalBackdrop>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingOfferId && (
          <ModalBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeletingOfferId(null)}
          >
            <ModalCard
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
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
                Delete Festival Offer?
              </h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '0.88rem', color: '#6c757d', lineHeight: '1.5' }}>
                Are you sure you want to delete this offer? It will be immediately removed from the customer portal as well.
              </p>

              <ModalActions style={{ justifyContent: 'center' }}>
                <button type="button" className="cancel-btn" onClick={() => setDeletingOfferId(null)}>
                  Cancel
                </button>
                <button type="button" className="save-btn" onClick={confirmDeleteOffer}>
                  Yes, Delete
                </button>
              </ModalActions>
            </ModalCard>
          </ModalBackdrop>
        )}
      </AnimatePresence>

      {/* Center Screen Animated Tick Notification Popup */}
      <AnimatedNotification notification={notification} onClose={() => setNotification(null)} />
    </AdminLayout>
  );
};

export default AdminOffers;
