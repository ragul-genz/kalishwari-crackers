import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import mysql from 'mysql2/promise';
import { connect as connectServerless } from '@tidbcloud/serverless';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// High-Performance Middleware: Gzip Compression & CORS
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Fast Server-Side In-Memory TTL Cache Store
const cacheStore = new Map();

function getCached(key) {
  const item = cacheStore.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    cacheStore.delete(key);
    return null;
  }
  return item.data;
}

function setCached(key, data, ttlMs = 60000) {
  cacheStore.set(key, { data, expiry: Date.now() + ttlMs });
}

export function clearCachePrefix(prefix) {
  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix)) cacheStore.delete(key);
  }
}

// Database connection state
let pool = null;
let serverlessConn = null;
let isConnected = false;
let connectionType = 'none'; // 'mysql2' | 'serverless' | 'memory'

// In-Memory fallback store if DB is offline or authenticating
const memoryStore = {
  products: [],
  categories: ["Sparklers", "Fountains", "Rockets", "Night Sky", "Gift Boxes"],
  deletedCategories: [],
  offers: [],
  blogs: [],
  orders: [],
  settings: {}
};

let isInitializing = false;

// Initialize TiDB Connection
export async function initDatabase() {
  if (isConnected || isInitializing) return;
  isInitializing = true;
  const host = process.env.DB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com';
  const port = parseInt(process.env.DB_PORT || '4000', 10);
  const user = process.env.DB_USER || '2jfg5VSYFyCSWGr.root';
  const password = process.env.DB_PASSWORD || 'fbKhrByYkqOlhF6S';
  const database = process.env.DB_NAME || 'kalishwaricrakers';

  console.log(`Connecting to TiDB Cloud [${host}:${port}]...`);

  // Attempt 1: Standard mysql2 connection pool
  try {
    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10,
      idleTimeout: 60000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      queueLimit: 0,
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: false
      }
    });

    const conn = await pool.getConnection();
    console.log('✅ TiDB MySQL Connection established via mysql2!');
    conn.release();
    isConnected = true;
    connectionType = 'mysql2';
  } catch (err1) {
    console.warn('⚠️ mysql2 pool connection failed:', err1.message);

    // Attempt 2: Serverless HTTP driver
    try {
      serverlessConn = connectServerless({
        host,
        username: user,
        password,
        database
      });
      await serverlessConn.execute('SELECT 1;');
      console.log('✅ TiDB Serverless Connection established via HTTP!');
      isConnected = true;
      connectionType = 'serverless';
    } catch (err2) {
      console.warn('⚠️ TiDB Serverless HTTP driver failed:', err2.message);
      console.warn('⚡ Using hybrid fallback store until DB connection credentials are active.');
      isConnected = false;
      connectionType = 'memory';
    }
  }

  // Create tables & Seed initial data if connected
  if (isConnected) {
    await setupTablesAndSeed();
  }
}

// SQL Query helper
async function query(sql, params = []) {
  if (!isConnected) {
    throw new Error('Database not connected');
  }
  if (connectionType === 'mysql2') {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } else if (connectionType === 'serverless') {
    const res = await serverlessConn.execute(sql, params);
    return res;
  }
}

// Create Tables & Seed Data
async function setupTablesAndSeed() {
  try {
    // 1. Products Table
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        regularPrice DECIMAL(10,2) NOT NULL,
        image LONGTEXT,
        stock VARCHAR(50) DEFAULT 'In Stock',
        isOffer TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Categories Table
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        name VARCHAR(100) PRIMARY KEY,
        is_deleted TINYINT(1) DEFAULT 0
      );
    `);

    // 3. Offers Table
    await query(`
      CREATE TABLE IF NOT EXISTS offers (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        discount VARCHAR(100),
        couponCode VARCHAR(100),
        description TEXT,
        image LONGTEXT,
        validUntil VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Blogs Table
    await query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        date VARCHAR(100),
        author VARCHAR(100),
        image LONGTEXT,
        excerpt TEXT,
        content LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Orders Table
    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        address TEXT,
        pincode VARCHAR(20),
        date VARCHAR(100),
        dateOnly VARCHAR(100),
        isoDate VARCHAR(50),
        itemsCount INT,
        totalAmount DECIMAL(10,2),
        cartItems LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Settings Table
    await query(`
      CREATE TABLE IF NOT EXISTS settings (
        key_name VARCHAR(100) PRIMARY KEY,
        setting_value LONGTEXT
      );
    `);

    // 7. Schema Performance Indexes
    try {
      await query(`CREATE INDEX idx_products_category ON products(category);`);
      await query(`CREATE INDEX idx_products_created ON products(created_at DESC);`);
      await query(`CREATE INDEX idx_offers_status ON offers(status);`);
      await query(`CREATE INDEX idx_blogs_created ON blogs(created_at DESC);`);
      await query(`CREATE INDEX idx_orders_created ON orders(created_at DESC);`);
    } catch (e) {
      // Indexes might already exist
    }

    console.log('✅ Database schema & performance indexes verified / initialized!');
  } catch (err) {
    console.error('❌ Table setup error:', err);
  }
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    databaseConnected: isConnected,
    connectionType,
    timestamp: new Date().toISOString()
  });
});

// --- SEO: Dynamic XML Sitemap (/sitemap.xml) for Google Search Console ---
app.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://kalishwaricrackers.com';
    const staticPages = [
      '',
      '/shop',
      '/cart',
      '/about',
      '/contact',
      '/blogs',
      '/offers'
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    const now = new Date().toISOString().split('T')[0];
    staticPages.forEach(p => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${p}</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += `    <changefreq>${p === '' || p === '/shop' ? 'daily' : 'weekly'}</changefreq>\n`;
      xml += `    <priority>${p === '' ? '1.0' : p === '/shop' ? '0.9' : '0.8'}</priority>\n`;
      xml += `  </url>\n`;
    });

    if (isConnected) {
      try {
        const products = await query('SELECT id, name, image FROM products');
        products.forEach(p => {
          xml += `  <url>\n`;
          xml += `    <loc>${baseUrl}/shop?product=${p.id}</loc>\n`;
          xml += `    <lastmod>${now}</lastmod>\n`;
          xml += `    <changefreq>weekly</changefreq>\n`;
          xml += `    <priority>0.7</priority>\n`;
          if (p.image && !p.image.startsWith('data:image')) {
            xml += `    <image:image>\n`;
            xml += `      <image:loc>${p.image.startsWith('http') ? p.image : baseUrl + p.image}</image:loc>\n`;
            xml += `      <image:title>${p.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:title>\n`;
            xml += `    </image:image>\n`;
          }
          xml += `  </url>\n`;
        });
      } catch (e) {
        // Skip dynamic additions if error
      }
    }

    xml += `</urlset>`;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

// --- SEO: Robots.txt (/robots.txt) for Google Search Console & AI Engines ---
app.get('/robots.txt', (req, res) => {
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/

User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Bingbot
Allow: /

# AI Search Crawlers Allowed (GEO - Generative Engine Optimization)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://kalishwaricrackers.com/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(robots);
});

// --- Google Search Console Verification File Handler ---
app.get('/google:code.html', (req, res) => {
  const code = req.params.code;
  res.setHeader('Content-Type', 'text/html');
  res.send(`google-site-verification: google${code}.html`);
});

// --- GEO & AEO: LLM Web Context Specification (/llms.txt) ---
app.get('/llms.txt', (req, res) => {
  const llmContext = `# Kalishwary Crackers - Official Brand & Product Specification

## Business Overview
- **Brand Name**: Kalishwary Crackers (Kalishwari Fireworks Sivakasi)
- **Origin**: Direct Sivakasi Factory Manufacturer & Wholesale Outlet, Tamil Nadu, India
- **Website**: https://kalishwaricrackers.com
- **Product Range**: Sparklers, Ground Chakkars, Flower Pots, Rockets, Multi-Sky Shots, Fancy Aerial Shells, Sound Crackers, CSIR-NEERI Certified Green Crackers, Festive Diwali Gift Combo Packs.
- **Pricing Strategy**: Direct Factory Wholesale Price (up to 80% OFF standard retail price).
- **Min Order Value**: ₹2,000 INR
- **Delivery Coverage**: All major districts in Tamil Nadu (Chennai, Coimbatore, Madurai, Salem, Trichy), Karnataka (Bengaluru), Telangana (Hyderabad), Andhra Pradesh, Kerala, and pan-India express transport.

## Quality & Safety Standards
- 100% genuine Sivakasi manufactured fireworks.
- Eco-friendly CSIR-NEERI certified green crackers with 30% reduced smoke & emissions.
- Secure transport-grade moisture-proof packaging.

## Frequently Asked Questions (AI Answer Engine Index)
Q: Where can I buy genuine Sivakasi crackers online at direct factory price?
A: Kalishwary Crackers (https://kalishwaricrackers.com) provides direct factory-priced Sivakasi crackers with up to 80% discount and nationwide transport delivery.

Q: Are Kalishwary Crackers eco-friendly?
A: Yes, all products comply with NEERI green cracker safety standards, reducing environmental pollution while maintaining vibrant colors and sound.

Q: How to download 2026 Sivakasi Diwali Cracker Price List PDF?
A: Visit https://kalishwaricrackers.com/shop to view and download the complete 2026 wholesale price list.
`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(llmContext);
});

// --- PRODUCTS API ---
app.get('/api/products', async (req, res) => {
  try {
    const cached = getCached('products');
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      return res.json(cached);
    }

    let data;
    if (isConnected) {
      data = await query('SELECT * FROM products ORDER BY created_at DESC');
    } else {
      data = memoryStore.products;
    }
    setCached('products', data, 60000);
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    return res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const p = req.body;
    if (!p.id || !p.name) {
      return res.status(400).json({ error: 'Product ID and Name required' });
    }
    clearCachePrefix('products');
    if (isConnected) {
      await query(
        `INSERT INTO products (id, name, category, price, regularPrice, image, stock, isOffer)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         name=VALUES(name), category=VALUES(category), price=VALUES(price),
         regularPrice=VALUES(regularPrice), image=VALUES(image), stock=VALUES(stock), isOffer=VALUES(isOffer)`,
        [p.id, p.name, p.category || 'Sparklers', p.price || 0, p.regularPrice || 0, p.image || '', p.stock || 'In Stock', p.isOffer ? 1 : 0]
      );
      return res.json({ success: true, product: p });
    }
    
    // Fallback memory store update
    const idx = memoryStore.products.findIndex(item => item.id === p.id);
    if (idx >= 0) memoryStore.products[idx] = p;
    else memoryStore.products.unshift(p);
    res.json({ success: true, product: p });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products/bulk', async (req, res) => {
  try {
    const productsList = req.body;
    if (!Array.isArray(productsList)) {
      return res.status(400).json({ error: 'Array expected' });
    }
    clearCachePrefix('products');
    if (isConnected) {
      for (const p of productsList) {
        await query(
          `INSERT INTO products (id, name, category, price, regularPrice, image, stock, isOffer)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
           name=VALUES(name), category=VALUES(category), price=VALUES(price),
           regularPrice=VALUES(regularPrice), image=VALUES(image), stock=VALUES(stock), isOffer=VALUES(isOffer)`,
          [p.id, p.name, p.category || 'Sparklers', p.price || 0, p.regularPrice || 0, p.image || '', p.stock || 'In Stock', p.isOffer ? 1 : 0]
        );
      }
      return res.json({ success: true, count: productsList.length });
    }
    memoryStore.products = productsList;
    res.json({ success: true, count: productsList.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    clearCachePrefix('products');
    if (isConnected) {
      await query('DELETE FROM products WHERE id = ?', [id]);
      return res.json({ success: true, id });
    }
    memoryStore.products = memoryStore.products.filter(p => p.id !== id);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CATEGORIES API ---
app.get('/api/categories', async (req, res) => {
  try {
    const cached = getCached('categories');
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      return res.json(cached);
    }
    let data;
    if (isConnected) {
      data = await query('SELECT name, is_deleted FROM categories');
    } else {
      data = memoryStore.categories.map(c => ({ name: c, is_deleted: 0 }));
    }
    setCached('categories', data, 60000);
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    return res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name required' });
    clearCachePrefix('categories');
    if (isConnected) {
      await query(
        'INSERT INTO categories (name, is_deleted) VALUES (?, 0) ON DUPLICATE KEY UPDATE is_deleted=0',
        [name.trim()]
      );
      return res.json({ success: true, name: name.trim() });
    }
    if (!memoryStore.categories.includes(name.trim())) memoryStore.categories.push(name.trim());
    res.json({ success: true, name: name.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/categories/:name', async (req, res) => {
  try {
    const { name } = req.params;
    clearCachePrefix('categories');
    if (isConnected) {
      await query(
        'INSERT INTO categories (name, is_deleted) VALUES (?, 1) ON DUPLICATE KEY UPDATE is_deleted=1',
        [name]
      );
      return res.json({ success: true, name });
    }
    memoryStore.categories = memoryStore.categories.filter(c => c !== name);
    res.json({ success: true, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- OFFERS API ---
app.get('/api/offers', async (req, res) => {
  try {
    const cached = getCached('offers');
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      return res.json(cached);
    }
    let data;
    if (isConnected) {
      data = await query('SELECT * FROM offers ORDER BY created_at DESC');
    } else {
      data = memoryStore.offers;
    }
    setCached('offers', data, 60000);
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    return res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/offers', async (req, res) => {
  try {
    const o = req.body;
    if (!o.id || !o.title) return res.status(400).json({ error: 'Offer ID and Title required' });
    clearCachePrefix('offers');
    if (isConnected) {
      await query(
        `INSERT INTO offers (id, title, discount, couponCode, description, image, validUntil, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         title=VALUES(title), discount=VALUES(discount), couponCode=VALUES(couponCode),
         description=VALUES(description), image=VALUES(image), validUntil=VALUES(validUntil), status=VALUES(status)`,
        [o.id, o.title, o.discount || 'OFFER', o.couponCode || '', o.description || '', o.image || '', o.validUntil || '2026-12-31', o.status || 'Active']
      );
      return res.json({ success: true, offer: o });
    }
    const idx = memoryStore.offers.findIndex(item => item.id === o.id);
    if (idx >= 0) memoryStore.offers[idx] = o;
    else memoryStore.offers.unshift(o);
    res.json({ success: true, offer: o });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/offers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    clearCachePrefix('offers');
    if (isConnected) {
      await query('DELETE FROM offers WHERE id = ?', [id]);
      return res.json({ success: true, id });
    }
    memoryStore.offers = memoryStore.offers.filter(o => o.id !== id);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- BLOGS API ---
app.get('/api/blogs', async (req, res) => {
  try {
    const cached = getCached('blogs');
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      return res.json(cached);
    }
    let data;
    if (isConnected) {
      data = await query('SELECT * FROM blogs ORDER BY created_at DESC');
    } else {
      data = memoryStore.blogs;
    }
    setCached('blogs', data, 60000);
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    return res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    const b = req.body;
    if (!b.id || !b.title) return res.status(400).json({ error: 'Blog ID and Title required' });
    clearCachePrefix('blogs');
    if (isConnected) {
      await query(
        `INSERT INTO blogs (id, title, category, date, author, image, excerpt, content)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         title=VALUES(title), category=VALUES(category), date=VALUES(date),
         author=VALUES(author), image=VALUES(image), excerpt=VALUES(excerpt), content=VALUES(content)`,
        [b.id, b.title, b.category || 'General', b.date || '', b.author || 'Admin', b.image || '', b.excerpt || '', b.content || '']
      );
      return res.json({ success: true, blog: b });
    }
    const idx = memoryStore.blogs.findIndex(item => item.id === b.id);
    if (idx >= 0) memoryStore.blogs[idx] = b;
    else memoryStore.blogs.unshift(b);
    res.json({ success: true, blog: b });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    clearCachePrefix('blogs');
    if (isConnected) {
      await query('DELETE FROM blogs WHERE id = ?', [id]);
      return res.json({ success: true, id });
    }
    memoryStore.blogs = memoryStore.blogs.filter(b => b.id !== id);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CUSTOMER ORDERS API ---
app.get('/api/orders', async (req, res) => {
  try {
    const cached = getCached('orders');
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'private, max-age=15');
      return res.json(cached);
    }
    let data;
    if (isConnected) {
      const rows = await query('SELECT * FROM orders ORDER BY created_at DESC');
      data = rows.map(r => ({
        ...r,
        cartItems: typeof r.cartItems === 'string' ? JSON.parse(r.cartItems || '[]') : (r.cartItems || [])
      }));
    } else {
      data = memoryStore.orders;
    }
    setCached('orders', data, 15000);
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'private, max-age=15');
    return res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const o = req.body;
    if (!o.id || !o.name) return res.status(400).json({ error: 'Order ID and Name required' });
    clearCachePrefix('orders');
    const cartItemsStr = JSON.stringify(o.cartItems || []);
    if (isConnected) {
      await query(
        `INSERT INTO orders (id, name, phone, address, pincode, date, dateOnly, isoDate, itemsCount, totalAmount, cartItems)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [o.id, o.name, o.phone || '', o.address || '', o.pincode || '', o.date || '', o.dateOnly || '', o.isoDate || '', o.itemsCount || 0, o.totalAmount || 0, cartItemsStr]
      );
      return res.json({ success: true, order: o });
    }
    memoryStore.orders.unshift(o);
    res.json({ success: true, order: o });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    clearCachePrefix('orders');
    if (isConnected) {
      await query('DELETE FROM orders WHERE id = ?', [id]);
      return res.json({ success: true, id });
    }
    memoryStore.orders = memoryStore.orders.filter(o => o.id !== id);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SETTINGS API ---
app.get('/api/settings', async (req, res) => {
  try {
    const cached = getCached('settings');
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      return res.json(cached);
    }
    let data = {};
    if (isConnected) {
      const rows = await query('SELECT key_name, setting_value FROM settings');
      rows.forEach(r => {
        try {
          data[r.key_name] = JSON.parse(r.setting_value);
        } catch {
          data[r.key_name] = r.setting_value;
        }
      });
    } else {
      data = memoryStore.settings;
    }
    setCached('settings', data, 60000);
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    return res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const settingsPayload = req.body;
    clearCachePrefix('settings');
    if (isConnected) {
      for (const [key, val] of Object.entries(settingsPayload)) {
        const jsonVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
        await query(
          'INSERT INTO settings (key_name, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)',
          [key, jsonVal]
        );
      }
      return res.json({ success: true, settings: settingsPayload });
    }
    memoryStore.settings = { ...memoryStore.settings, ...settingsPayload };
    res.json({ success: true, settings: settingsPayload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default app;

// Start Server locally if not running on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`🚀 Kalishwari Crackers API Server running on port ${PORT}`);
    await initDatabase();
  });
}
