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

// --- PRODUCTS API ---
export async function fetchProductsApi() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function saveProductApi(product) {
  try {
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
    const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete product');
    return await res.json();
  } catch (e) {
    return null;
  }
}

// --- CATEGORIES API ---
export async function fetchCategoriesApi() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function saveCategoryApi(name) {
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function deleteCategoryApi(name) {
  try {
    const res = await fetch(`${API_BASE}/categories/${encodeURIComponent(name)}`, { method: 'DELETE' });
    return await res.json();
  } catch (e) {
    return null;
  }
}

// --- OFFERS API ---
export async function fetchOffersApi() {
  try {
    const res = await fetch(`${API_BASE}/offers`);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function saveOfferApi(offer) {
  try {
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
    const res = await fetch(`${API_BASE}/offers/${id}`, { method: 'DELETE' });
    return await res.json();
  } catch (e) {
    return null;
  }
}

// --- BLOGS API ---
export async function fetchBlogsApi() {
  try {
    const res = await fetch(`${API_BASE}/blogs`);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function saveBlogApi(blog) {
  try {
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
    const res = await fetch(`${API_BASE}/blogs/${id}`, { method: 'DELETE' });
    return await res.json();
  } catch (e) {
    return null;
  }
}

// --- ORDERS API ---
export async function fetchOrdersApi() {
  try {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function saveOrderApi(order) {
  try {
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
    const res = await fetch(`${API_BASE}/orders/${id}`, { method: 'DELETE' });
    return await res.json();
  } catch (e) {
    return null;
  }
}

// --- SETTINGS API ---
export async function fetchSettingsApi() {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function saveSettingsApi(settings) {
  try {
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
