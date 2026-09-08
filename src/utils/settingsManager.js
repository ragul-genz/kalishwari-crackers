import logoImg from '../assets/logo.jpg';
import { notifyDataSync } from './syncManager';

const SETTINGS_STORAGE_KEY = 'kalishwari_store_settings';

// Lightweight Synchronous SHA-256 Hashing Algorithm
export function sha256(ascii) {
  if (!ascii) return '';
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  
  var mathPow = Math.pow;
  var maxWord = mathPow(2, 32);
  var lengthProperty = 'length';
  var i, j;
  var result = '';

  var words = [];
  var asciiBitLength = ascii[lengthProperty] * 8;
  
  var hash = sha256.h = sha256.h || [];
  var k = sha256.k = sha256.k || [];
  var primeCounter = k[lengthProperty];

  var isComposite = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 300; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  
  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return '';
    words[i >> 2] |= j << ((3 - i % 4) * 8);
  }
  words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
  words[words[lengthProperty]] = (asciiBitLength);
  
  for (j = 0; j < words[lengthProperty];) {
    var w = words.slice(j, j += 16);
    var oldHash = hash;
    hash = hash.slice(0, 8);
    
    for (i = 0; i < 64; i++) {
      var w15 = w[i - 15], w2 = w[i - 2];
      var a = hash[0], e = hash[4];
      var temp1 = hash[7]
        + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
        + ((e & hash[5]) ^ ((~e) & hash[6]))
        + k[i]
        + (w[i] = (i < 16) ? w[i] : (
            w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
          ) | 0
        );
      var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
        + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }
  
  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      var b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? 0 : '') + b.toString(16);
    }
  }
  return result;
}

const DEFAULT_PLAIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'kalishwari123';
const DEFAULT_PASSWORD_HASH = sha256(DEFAULT_PLAIN_PASSWORD);

export const DEFAULT_SETTINGS = {
  shopName: 'Kalishwari Crackers',
  logo: logoImg,
  adBannerText: '⚡ DIRECT FACTORY WHOLESALE RATES | 100% GENUINE SIVAKASI FIREWORKS | FREE DELIVERY ON ORDERS ABOVE ₹3,000 | SPECIAL FESTIVAL DISCOUNTS ACTIVE! ⚡',
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  email: 'info@kalishwaricrackers.com',
  address: '123 Fireworks Lane, Sivakasi, Tamil Nadu 626123, India',
  adminUsername: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
  adminPasswordHash: DEFAULT_PASSWORD_HASH
};

export const getStoredSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);

    // Migration: If plain text adminPassword is in localStorage, convert to SHA-256 hash
    if (parsed.adminPassword && !parsed.adminPasswordHash) {
      parsed.adminPasswordHash = sha256(parsed.adminPassword);
      delete parsed.adminPassword;
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(parsed));
    }

    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      logo: parsed.logo || DEFAULT_SETTINGS.logo,
      adminPasswordHash: parsed.adminPasswordHash || DEFAULT_PASSWORD_HASH
    };
  } catch (error) {
    console.error('Error reading store settings:', error);
    return { ...DEFAULT_SETTINGS };
  }
};

export const saveStoredSettings = (newSettings) => {
  try {
    const current = getStoredSettings();
    
    // If adminPassword plain text is passed in payload, hash it immediately
    const payload = { ...newSettings };
    if (payload.adminPassword) {
      payload.adminPasswordHash = sha256(payload.adminPassword);
      delete payload.adminPassword;
    }

    const updated = {
      ...current,
      ...payload
    };

    // Guarantee plain text password is never stored
    delete updated.adminPassword;

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    notifyDataSync('settingsUpdated');
    return updated;
  } catch (error) {
    console.error('Error saving store settings:', error);
    return getStoredSettings();
  }
};

export const verifyAdminCredentials = (username, password) => {
  const settings = getStoredSettings();
  const validUsername = settings.adminUsername || DEFAULT_SETTINGS.adminUsername;
  const validPasswordHash = settings.adminPasswordHash || DEFAULT_PASSWORD_HASH;

  const inputPasswordHash = sha256(password);
  return username === validUsername && inputPasswordHash === validPasswordHash;
};

export const updateAdminCredentials = (newUsername, newPassword) => {
  const payload = { adminUsername: newUsername };
  if (newPassword) {
    payload.adminPasswordHash = sha256(newPassword);
  }
  return saveStoredSettings(payload);
};
