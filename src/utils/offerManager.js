import sparklersImg from '../assets/images/sparklers.jpg';
import rocketsImg from '../assets/images/rockets.jpg';
import { notifyDataSync } from './syncManager';

const OFFERS_STORAGE_KEY = 'kalishwari_stored_offers';

export const PRESET_OFFER_IMAGES = [
  { name: 'Sparklers Banner', url: sparklersImg },
  { name: 'Rockets Banner', url: rocketsImg }
];

export const INITIAL_OFFERS = [
  {
    id: 'offer-1',
    title: 'Diwali Mega Sale (80% Off)',
    discount: '80% OFF',
    couponCode: 'DIWALI80',
    description: 'Get up to 80% discount on all cracker gift boxes & family packs this festival season!',
    image: sparklersImg,
    validUntil: '2026-11-15',
    status: 'Active'
  },
  {
    id: 'offer-2',
    title: 'Free Shipping Promo',
    discount: 'FREE DELIVERY',
    couponCode: 'FREESHIP3K',
    description: 'Free doorstep delivery across Tamil Nadu & South India for all orders above ₹3,000.',
    image: rocketsImg,
    validUntil: '2026-12-31',
    status: 'Active'
  }
];

export const getStoredOffers = () => {
  try {
    const raw = localStorage.getItem(OFFERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(INITIAL_OFFERS));
      return INITIAL_OFFERS;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading offers from localStorage:', error);
    return INITIAL_OFFERS;
  }
};

export const saveStoredOffers = (offers) => {
  try {
    localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(offers));
    notifyDataSync('offersUpdated');
  } catch (error) {
    console.error('Error saving offers to localStorage:', error);
  }
};

export const addOffer = (offerData) => {
  const current = getStoredOffers();
  const newOffer = {
    id: `offer-${Date.now()}`,
    title: offerData.title.trim(),
    discount: offerData.discount.trim() || 'OFFER',
    couponCode: (offerData.couponCode || '').toUpperCase().trim(),
    description: offerData.description.trim(),
    image: offerData.image || sparklersImg,
    validUntil: offerData.validUntil || '2026-12-31',
    status: offerData.status || 'Active'
  };
  const updated = [newOffer, ...current];
  saveStoredOffers(updated);
  return updated;
};

export const updateOffer = (id, updatedData) => {
  const current = getStoredOffers();
  const updated = current.map(offer => 
    offer.id === id ? { ...offer, ...updatedData } : offer
  );
  saveStoredOffers(updated);
  return updated;
};

export const deleteOffer = (id) => {
  const current = getStoredOffers();
  const updated = current.filter(offer => offer.id !== id);
  saveStoredOffers(updated);
  return updated;
};
