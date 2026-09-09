// Centralized API Client with Image Compression & DB Health Check

const API_BASE = '/api';

/**
 * Check if the Express backend and TiDB database are online
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) return { databaseConnected: false, status: 'offline' };
    return await res.json();
  } catch (e) {
    return { databaseConnected: false, status: 'offline' };
  }
}

/**
 * Client-Side Image Compression using HTML Canvas
 * Reduces file size dramatically before database storage
 */
export function compressImage(source, maxWidth = 1000, quality = 0.7) {
  return new Promise((resolve) => {
    if (!source) return resolve('');
    if (typeof source !== 'string' && !(source instanceof File || source instanceof Blob)) {
      return resolve(source);
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF'; // Fill transparent pixels with white
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Export as compressed WebP or JPEG
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      // If compression fails (e.g. invalid image format), return original
      resolve(typeof source === 'string' ? source : '');
    };

    if (source instanceof File || source instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(source);
    } else {
      img.src = source;
    }
  });
}

// Client-side Memory Cache for instant rendering (30-second TTL)
const clientCache = new Map();

async function fetchWithCache(url, ttlMs = 30000) {
  const cached = clientCache.get(url);
  const now = Date.now();
  if (cached && (now - cached.timestamp < ttlMs)) {
    return cached.data;
  }
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response failed');
    const data = await res.json();
    clientCache.set(url, { data, timestamp: now });
    return data;
  } catch (e) {
    if (cached) return cached.data;
    return null;
  }
}

export function invalidateClientCache(urlPrefix) {
  for (const key of clientCache.keys()) {
    if (key.includes(urlPrefix)) clientCache.delete(key);
  }
}

// --- PRODUCTS API ---
export async function fetchProductsApi() {
  return fetchWithCache(`${API_BASE}/products`);
}

export async function saveProductApi(product) {
  try {
    invalidateClientCache('/products');
    // Compress image before saving to DB
    if (product.image && product.image.startsWith('data:image')) {
      product.image = await compressImage(product.image, 800, 0.7);
    }

    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to save product');
    return await res.json();
  } catch (e) {
    console.error('saveProductApi error:', e);
    return null;
  }
}

export async function saveProductsBulkApi(products) {
  try {
    invalidateClientCache('/products');
    const res = await fetch(`${API_BASE}/products/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(products)
    });
    if (!res.ok) throw new Error('Failed to save products bulk');
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function deleteProductApi(id) {
  try {
    invalidateClientCache('/products');
    const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete product');
    return await res.json();
  } catch (e) {
    return null;
  }
}

// --- CATEGORIES API ---
export async function fetchCategoriesApi() {
  return fetchWithCache(`${API_BASE}/categories`);
}

export async function saveCategoryApi(name, image = '') {
  try {
    invalidateClientCache('/categories');
    let imageToSave = image;
    if (imageToSave && imageToSave.startsWith('data:image')) {
      imageToSave = await compressImage(imageToSave, 1000, 0.7);
    }
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, image: imageToSave })
    });
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function deleteCategoryApi(name) {
  try {
    invalidateClientCache('/categories');
    const res = await fetch(`${API_BASE}/categories/${encodeURIComponent(name)}`, { method: 'DELETE' });
    return await res.json();
  } catch (e) {
    return null;
  }
}

// --- OFFERS API ---
export async function fetchOffersApi() {
  return fetchWithCache(`${API_BASE}/offers`);
}

export async function saveOfferApi(offer) {
  try {
    invalidateClientCache('/offers');
    if (offer.image && offer.image.startsWith('data:image')) {
      offer.image = await compressImage(offer.image, 1000, 0.7);
    }
    const res = await fetch(`${API_BASE}/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offer)
    });
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function deleteOfferApi(id) {
  try {
    invalidateClientCache('/offers');
    const res = await fetch(`${API_BASE}/offers/${id}`, { method: 'DELETE' });
    return await res.json();
  } catch (e) {
    return null;
  }
}

// --- BLOGS API ---
export async function fetchBlogsApi() {
  return fetchWithCache(`${API_BASE}/blogs`);
}

export async function saveBlogApi(blog) {
  try {
    invalidateClientCache('/blogs');
    if (blog.image && blog.image.startsWith('data:image')) {
      blog.image = await compressImage(blog.image, 1000, 0.7);
    }
    const res = await fetch(`${API_BASE}/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blog)
    });
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function deleteBlogApi(id) {
  try {
    invalidateClientCache('/blogs');
    const res = await fetch(`${API_BASE}/blogs/${id}`, { method: 'DELETE' });
    return await res.json();
  } catch (e) {
    return null;
  }
}

// --- ORDERS API ---
export async function fetchOrdersApi() {
  return fetchWithCache(`${API_BASE}/orders`, 15000);
}

export async function saveOrderApi(order) {
  try {
    invalidateClientCache('/orders');
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function deleteOrderApi(id) {
  try {
    invalidateClientCache('/orders');
    const res = await fetch(`${API_BASE}/orders/${id}`, { method: 'DELETE' });
    return await res.json();
  } catch (e) {
    return null;
  }
}

// --- SETTINGS API ---
export async function fetchSettingsApi() {
  return fetchWithCache(`${API_BASE}/settings`);
}

export async function saveSettingsApi(settings) {
  try {
    invalidateClientCache('/settings');
    if (settings.logo && settings.logo.startsWith('data:image')) {
      settings.logo = await compressImage(settings.logo, 500, 0.8);
    }
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return await res.json();
  } catch (e) {
    return null;
  }
}
