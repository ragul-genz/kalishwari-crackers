import bannerBg from '../assets/images/sparklers.jpg';
import fireworks1 from '../assets/images/rockets.jpg';
import fireworks2 from '../assets/images/fountains.jpg';
import { notifyDataSync } from './syncManager';

export const INITIAL_BLOGS = [
  {
    id: 'blog-1',
    title: "How to Celebrate a Safe and Eco-Friendly Diwali",
    category: "Safety Tips",
    date: "October 10, 2026",
    author: "Admin",
    image: fireworks1,
    excerpt: "Discover the best practices for celebrating the festival of lights with your family safely. Tips on handling sparklers, safe distances, and eco-friendly choices.",
    content: "Diwali is the festival of lights and joy! To ensure a safe celebration for everyone, always burst crackers in open spaces, keep a bucket of water nearby, wear cotton clothes, and follow manufacturer instructions. Eco-friendly green crackers emit less smoke and reduce sound pollution significantly."
  },
  {
    id: 'blog-2',
    title: "Top 10 Fireworks to Buy for Kids in 2026",
    category: "Fireworks Guide",
    date: "September 28, 2026",
    author: "Kalishwari Team",
    image: fireworks2,
    excerpt: "Looking for the safest and most colorful crackers for your children? We have curated a list of the top 10 kid-friendly fireworks including flower pots and chakkars.",
    content: "Children love colorful, low-noise fireworks like sparklers, flower pots, ground chakkars, and pop-pops. Always supervise young children and provide sparkler holders or gloves for extra safety."
  },
  {
    id: 'blog-3',
    title: "The History of Sivakasi Fireworks Industry",
    category: "History & Legacy",
    date: "September 15, 2026",
    author: "Guest Writer",
    image: bannerBg,
    excerpt: "Take a deep dive into how Sivakasi became the fireworks capital of India. Learn about the legacy and the craftsmanship behind our premium crackers.",
    content: "Sivakasi's fireworks industry began in the 1920s and has grown into the leading hub for matchboxes, printing, and pyrotechnics in India. Kalishwari Crackers preserves this rich legacy by manufacturing high-quality, eco-conscious crackers."
  }
];

export const PRESET_BLOG_IMAGES = [
  { name: 'Rockets & Sky Light', url: fireworks1 },
  { name: 'Fountains & Sparkles', url: fireworks2 },
  { name: 'Festival Sparklers', url: bannerBg },
];

export const BLOG_CATEGORIES = [
  "Safety Tips",
  "Fireworks Guide",
  "History & Legacy",
  "Diwali Specials",
  "Festival News",
  "Product Highlights"
];

const STORAGE_KEY = 'kalishwari_blogs_db';

export const getStoredBlogs = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load blogs from storage', e);
  }
  return INITIAL_BLOGS;
};

export const saveStoredBlogs = (blogs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
    notifyDataSync('blogsUpdated');
  } catch (e) {
    console.error('Failed to save blogs to storage', e);
  }
};

export const addBlog = (newBlogData) => {
  const currentBlogs = getStoredBlogs();
  const newBlog = {
    id: `blog-${Date.now()}`,
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    author: newBlogData.author || 'Admin',
    image: newBlogData.image || fireworks1,
    ...newBlogData,
  };
  const updated = [newBlog, ...currentBlogs];
  saveStoredBlogs(updated);
  return newBlog;
};

export const updateBlog = (id, updatedData) => {
  const currentBlogs = getStoredBlogs();
  const updated = currentBlogs.map(blog => 
    blog.id === id ? { ...blog, ...updatedData } : blog
  );
  saveStoredBlogs(updated);
};

export const deleteBlog = (id) => {
  const currentBlogs = getStoredBlogs();
  const updated = currentBlogs.filter(blog => blog.id !== id);
  saveStoredBlogs(updated);
};
