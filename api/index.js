import app, { initDatabase } from '../server.js';

let isDbInited = false;

export default async function handler(req, res) {
  if (!isDbInited) {
    try {
      await initDatabase();
    } catch (e) {
      console.error('Database initialization error:', e);
    }
    isDbInited = true;
  }
  return app(req, res);
}
