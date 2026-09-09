import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { connect as connectServerless } from '@tidbcloud/serverless';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and large JSON body payload for base64 images
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

// Initialize TiDB Connection
async function initDatabase() {
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

    console.log('✅ Database schema verified / initialized!');
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

// --- PRODUCTS API ---
app.get('/api/products', async (req, res) => {
  try {
    if (isConnected) {
      const rows = await query('SELECT * FROM products ORDER BY created_at DESC');
      return res.json(rows);
    }
    res.json(memoryStore.products);
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
    if (isConnected) {
      const rows = await query('SELECT name, is_deleted FROM categories');
      return res.json(rows);
    }
    res.json(memoryStore.categories.map(c => ({ name: c, is_deleted: 0 })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name required' });
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
    if (isConnected) {
      const rows = await query('SELECT * FROM offers ORDER BY created_at DESC');
      return res.json(rows);
    }
    res.json(memoryStore.offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/offers', async (req, res) => {
  try {
    const o = req.body;
    if (!o.id || !o.title) return res.status(400).json({ error: 'Offer ID and Title required' });
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
    if (isConnected) {
      const rows = await query('SELECT * FROM blogs ORDER BY created_at DESC');
      return res.json(rows);
    }
    res.json(memoryStore.blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    const b = req.body;
    if (!b.id || !b.title) return res.status(400).json({ error: 'Blog ID and Title required' });
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
    if (isConnected) {
      const rows = await query('SELECT * FROM orders ORDER BY created_at DESC');
      const formatted = rows.map(r => ({
        ...r,
        cartItems: typeof r.cartItems === 'string' ? JSON.parse(r.cartItems || '[]') : (r.cartItems || [])
      }));
      return res.json(formatted);
    }
    res.json(memoryStore.orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const o = req.body;
    if (!o.id || !o.name) return res.status(400).json({ error: 'Order ID and Name required' });
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
    if (isConnected) {
      const rows = await query('SELECT key_name, setting_value FROM settings');
      const settingsObj = {};
      rows.forEach(r => {
        try {
          settingsObj[r.key_name] = JSON.parse(r.setting_value);
        } catch {
          settingsObj[r.key_name] = r.setting_value;
        }
      });
      return res.json(settingsObj);
    }
    res.json(memoryStore.settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const settingsPayload = req.body;
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

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 Kalishwari Crackers API Server running on port ${PORT}`);
  await initDatabase();
});
