import sparklersImg from '../assets/images/sparklers.jpg';
import rocketsImg from '../assets/images/rockets.jpg';
import { notifyDataSync } from './syncManager';
import { fetchOffersApi, saveOfferApi, deleteOfferApi } from './api';

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

export const getOffersAsync = async () => {
  try {
    const apiOffers = await fetchOffersApi();
    if (Array.isArray(apiOffers)) {
      if (apiOffers.length === 0) {
        // Seed initial offers
        for (const o of INITIAL_OFFERS) {
          await saveOfferApi(o);
        }
        localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(INITIAL_OFFERS));
        return INITIAL_OFFERS;
      }
      localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(apiOffers));
      return apiOffers;
    }
  } catch (e) {
    console.warn('API fetch error for offers:', e);
  }
  return getStoredOffers();
};

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

export const addOffer = async (offerData) => {
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
  await saveOfferApi(newOffer);
  return updated;
};

export const updateOffer = async (id, updatedData) => {
  const current = getStoredOffers();
  let updatedRecord = null;
  const updated = current.map(offer => {
    if (offer.id === id) {
      updatedRecord = { ...offer, ...updatedData };
      return updatedRecord;
    }
    return offer;
  });
  saveStoredOffers(updated);
  if (updatedRecord) {
    await saveOfferApi(updatedRecord);
  }
  return updated;
};

export const deleteOffer = async (id) => {
  const current = getStoredOffers();
  const updated = current.filter(offer => offer.id !== id);
  saveStoredOffers(updated);
  await deleteOfferApi(id);
  return updated;
};
