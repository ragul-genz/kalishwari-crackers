import sparklersImg from '../assets/images/sparklers.jpg';
import fountainsImg from '../assets/images/fountains.jpg';
import rocketsImg from '../assets/images/rockets.jpg';
import { notifyDataSync } from './syncManager';

export const INITIAL_PRODUCTS = [
  { id: "Sparklers-1", name: "Gold Sparklers (10cm)", category: "Sparklers", price: 15, regularPrice: 150, image: sparklersImg, stock: "In Stock", isOffer: true },
  { id: "Sparklers-2", name: "Color Sparklers (15cm)", category: "Sparklers", price: 20, regularPrice: 200, image: sparklersImg, stock: "In Stock", isOffer: true },
  { id: "Fountains-1", name: "Flower Pot Big", category: "Fountains", price: 35, regularPrice: 350, image: fountainsImg, stock: "In Stock", isOffer: true },
  { id: "Fountains-2", name: "Chakkars Special", category: "Fountains", price: 25, regularPrice: 250, image: fountainsImg, stock: "In Stock", isOffer: true },
  { id: "Rockets-1", name: "Sky Rocket (Pack of 10)", category: "Rockets", price: 40, regularPrice: 400, image: rocketsImg, stock: "In Stock", isOffer: true },
  { id: "Night Sky-1", name: "12 Shots Night Sky", category: "Night Sky", price: 80, regularPrice: 800, image: fountainsImg, stock: "In Stock", isOffer: true },
  { id: "Night Sky-2", name: "30 Shots Multi-color", category: "Night Sky", price: 150, regularPrice: 1500, image: fountainsImg, stock: "In Stock", isOffer: true },
  { id: "Gift Boxes-1", name: "Kalishwary Special Gift Box", category: "Gift Boxes", price: 250, regularPrice: 2500, image: sparklersImg, stock: "In Stock", isOffer: true },
];

export const PRESET_IMAGES = [
  { name: 'Sparklers Image', url: sparklersImg },
  { name: 'Fountains Image', url: fountainsImg },
  { name: 'Rockets Image', url: rocketsImg },
];

export const DEFAULT_CATEGORIES = ["Sparklers", "Fountains", "Rockets", "Night Sky", "Gift Boxes"];
const CATEGORIES_STORAGE_KEY = 'kalishwari_categories_db';
const DELETED_CATEGORIES_KEY = 'kalishwari_deleted_categories_db';

export const generateNextProductId = (category, currentProducts = []) => {
  const catName = (category || 'Product').trim();
  const catProducts = currentProducts.filter(
    p => p.category && p.category.trim().toLowerCase() === catName.toLowerCase()
  );

  let maxNum = 0;
  catProducts.forEach(p => {
    if (typeof p.id === 'string') {
      const match = p.id.match(/(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    } else if (typeof p.id === 'number') {
      if (p.id < 100000 && p.id > maxNum) maxNum = p.id;
    }
  });

  const nextIndex = maxNum > 0 ? maxNum + 1 : catProducts.length + 1;
  return `${catName}-${nextIndex}`;
};

export const getStoredCategories = () => {
  try {
    const data = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    const customCats = data ? JSON.parse(data) : [];
    const deletedData = localStorage.getItem(DELETED_CATEGORIES_KEY);
    const deletedCats = deletedData ? JSON.parse(deletedData) : [];

    const products = getStoredProducts();
    const productCats = products.map(p => p.category);

    const allCombined = [...DEFAULT_CATEGORIES, ...customCats, ...productCats];
    return Array.from(new Set(allCombined)).filter(c => !deletedCats.includes(c));
  } catch (e) {
    console.error('Failed to load categories', e);
  }
  const products = getStoredProducts();
  return Array.from(new Set([...DEFAULT_CATEGORIES, ...products.map(p => p.category)]));
};

export const saveCategory = (newCat) => {
  if (!newCat || !newCat.trim()) return;
  const trimmed = newCat.trim();
  try {
    const data = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    const customCats = data ? JSON.parse(data) : [];
    if (!customCats.includes(trimmed) && !DEFAULT_CATEGORIES.includes(trimmed)) {
      customCats.push(trimmed);
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(customCats));
    }

    const deletedData = localStorage.getItem(DELETED_CATEGORIES_KEY);
    let deletedCats = deletedData ? JSON.parse(deletedData) : [];
    if (deletedCats.includes(trimmed)) {
      deletedCats = deletedCats.filter(c => c !== trimmed);
      localStorage.setItem(DELETED_CATEGORIES_KEY, JSON.stringify(deletedCats));
    }

    notifyDataSync('productsUpdated');
  } catch (e) {
    console.error('Failed to save category', e);
  }
};

export const deleteCategory = (catToDelete) => {
  if (!catToDelete || catToDelete === 'All') return;
  try {
    const data = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    let customCats = data ? JSON.parse(data) : [];
    customCats = customCats.filter(c => c !== catToDelete);
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(customCats));

    const deletedData = localStorage.getItem(DELETED_CATEGORIES_KEY);
    let deletedCats = deletedData ? JSON.parse(deletedData) : [];
    if (!deletedCats.includes(catToDelete)) {
      deletedCats.push(catToDelete);
    }
    localStorage.setItem(DELETED_CATEGORIES_KEY, JSON.stringify(deletedCats));

    // Reassign products belonging to this deleted category to 'Sparklers' (or default)
    const products = getStoredProducts();
    const updatedProducts = products.map(p => {
      if (p.category === catToDelete) {
        return { ...p, category: 'Sparklers' };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
    notifyDataSync('productsUpdated');
  } catch (e) {
    console.error('Failed to delete category', e);
  }
};

const STORAGE_KEY = 'kalishwari_products_db';

export const getStoredProducts = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Format legacy numeric or timestamp IDs to Category-Index format (e.g. Sparklers-1)
        const categoryCounts = {};
        const formatted = parsed.map(p => {
          const cat = (p.category || 'General').trim();
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
          
          if (typeof p.id === 'string' && p.id.toLowerCase().startsWith(cat.toLowerCase())) {
            return p;
          }
          return {
            ...p,
            id: `${cat}-${categoryCounts[cat]}`
          };
        });
        return formatted;
      }
    }
  } catch (e) {
    console.error('Failed to load products from storage', e);
  }
  return INITIAL_PRODUCTS;
};

export const saveStoredProducts = (products) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    notifyDataSync('productsUpdated');
  } catch (e) {
    console.error('Failed to save products to storage', e);
  }
};

