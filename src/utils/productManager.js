import sparklersImg from '../assets/images/sparklers.jpg';
import fountainsImg from '../assets/images/fountains.jpg';
import rocketsImg from '../assets/images/rockets.jpg';
import { notifyDataSync } from './syncManager';
import {
  fetchProductsApi,
  saveProductApi,
  saveProductsBulkApi,
  deleteProductApi,
  fetchCategoriesApi,
  saveCategoryApi,
  deleteCategoryApi
} from './api';

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
const STORAGE_KEY = 'kalishwari_products_db';

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

/**
 * Fetch products from database asynchronously with fallback to cache/initial data
 */
export const getProductsAsync = async () => {
  try {
    const apiProducts = await fetchProductsApi();
    if (Array.isArray(apiProducts)) {
      if (apiProducts.length === 0) {
        // Seed initial products to DB if empty
        await saveProductsBulkApi(INITIAL_PRODUCTS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apiProducts));
      return apiProducts;
    }
  } catch (e) {
    console.warn('API fetch error for products:', e);
  }
  return getStoredProducts();
};

export const getStoredProducts = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load products from storage', e);
  }
  return INITIAL_PRODUCTS;
};

export const saveSingleProduct = async (product) => {
  try {
    const current = getStoredProducts();
    const idx = current.findIndex(p => p.id === product.id);
    let updated;
    if (idx >= 0) {
      updated = current.map(p => p.id === product.id ? product : p);
    } else {
      updated = [product, ...current];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    await saveProductApi(product);
    notifyDataSync('productsUpdated');
    return updated;
  } catch (e) {
    console.error('Failed to save product', e);
  }
};

export const saveStoredProducts = async (products) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    await saveProductsBulkApi(products);
    notifyDataSync('productsUpdated');
  } catch (e) {
    console.error('Failed to save products to storage', e);
  }
};

export const deleteSingleProduct = async (id) => {
  try {
    const current = getStoredProducts();
    const updated = current.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    await deleteProductApi(id);
    notifyDataSync('productsUpdated');
    return updated;
  } catch (e) {
    console.error('Failed to delete product', e);
  }
};

// CATEGORIES MANAGEMENT
export const getStoredCategories = () => {
  try {
    const data = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    const customCats = data ? JSON.parse(data) : [];
    const deletedData = localStorage.getItem(DELETED_CATEGORIES_KEY);
    const deletedCats = deletedData ? JSON.parse(deletedData) : [];

    const products = getStoredProducts();
    const productCats = products.map(p => p.category);

    const allCombined = [...DEFAULT_CATEGORIES, ...customCats, ...productCats];
    return Array.from(new Set(allCombined)).filter(c => Boolean(c) && !deletedCats.includes(c));
  } catch (e) {
    console.error('Failed to load categories', e);
  }
  const products = getStoredProducts();
  return Array.from(new Set([...DEFAULT_CATEGORIES, ...products.map(p => p.category)]));
};

export const getCategoriesAsync = async () => {
  try {
    const apiCats = await fetchCategoriesApi();
    if (Array.isArray(apiCats)) {
      const activeCats = apiCats.filter(c => !c.is_deleted).map(c => c.name);
      if (activeCats.length > 0) {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(activeCats));
      }
    }
  } catch (e) {
    console.warn('API error for categories:', e);
  }
  return getStoredCategories();
};

export const saveCategory = async (newCat) => {
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

    await saveCategoryApi(trimmed);
    notifyDataSync('productsUpdated');
  } catch (e) {
    console.error('Failed to save category', e);
  }
};

export const deleteCategory = async (catToDelete) => {
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

    // Reassign products belonging to this deleted category to 'Sparklers'
    const products = getStoredProducts();
    const updatedProducts = products.map(p => {
      if (p.category === catToDelete) {
        return { ...p, category: 'Sparklers' };
      }
      return p;
    });
    await saveStoredProducts(updatedProducts);
    await deleteCategoryApi(catToDelete);
    notifyDataSync('productsUpdated');
  } catch (e) {
    console.error('Failed to delete category', e);
  }
};
