import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { localBusinessSchema, websiteSchema, faqSchema, breadcrumbSchema } from '../utils/seoSchemas';

const ROUTE_SEO = {
  '/': {
    title: 'Kalishwary Crackers | #1 Sivakasi Wholesale Fireworks Store',
    description: 'Buy genuine Sivakasi crackers online at direct factory wholesale prices. Up to 80% discount on Green Crackers, Sparklers, Rockets, Sky Shots & Gift Boxes.',
    keywords: 'sivakasi crackers online, buy crackers online, wholesale crackers sivakasi, green crackers, diwali price list 2026, kalishwari crackers'
  },
  '/shop': {
    title: 'Shop Fireworks & Sivakasi Crackers Online | Wholesale Price List',
    description: 'Explore our complete 2026 Sivakasi Fireworks catalog. Sparklers, Ground Chakkars, Flower Pots, Rockets, Multi-sky shots & Combo boxes at lowest rates.',
    keywords: 'shop crackers online, sivakasi cracker price list, sparklers, rockets, diwali gift box, fireworks store'
  },
  '/cart': {
    title: 'Shopping Cart | Kalishwary Crackers Online Order',
    description: 'Review your selected Sivakasi crackers cart. Fast door delivery across Tamil Nadu, Bangalore, Hyderabad & all India.',
    keywords: 'crackers cart, order fireworks online, diwali order checkout'
  },
  '/about': {
    title: 'About Us | Kalishwary Crackers Sivakasi Direct Factory Supplier',
    description: 'Learn about Kalishwary Crackers, Sivakasi leading certified fireworks manufacturer with 100% genuine green crackers and wholesale supply.',
    keywords: 'about kalishwari crackers, sivakasi fireworks manufacturer, certified green crackers supplier'
  },
  '/contact': {
    title: 'Contact Us | Kalishwary Crackers Sivakasi Wholesale Booking',
    description: 'Contact Kalishwary Crackers Sivakasi for wholesale enquiries, bulk price list, and customer support. Call/WhatsApp +91-9876543210.',
    keywords: 'contact sivakasi crackers, fireworks wholesale inquiry, kalishwari crackers phone number'
  },
  '/blogs': {
    title: 'Fireworks Safety & Diwali Celebration Guides | Kalishwary Crackers',
    description: 'Read expert articles on cracker safety tips, green fireworks guide, Diwali celebration ideas, and Sivakasi manufacturing insights.',
    keywords: 'fireworks safety tips, green crackers guide, diwali celebration blogs'
  },
  '/offers': {
    title: 'Special Diwali Offers & Cracker Combo Discounts | Kalishwary Crackers',
    description: 'Exclusive Diwali cracker discounts up to 80% OFF. Check out special festival combo family packs and early bird promo offers.',
    keywords: 'cracker offers, diwali discount combo, early bird fireworks sale'
  }
};

export const SEOHead = () => {
  const location = useLocation();
  const path = location.pathname;
  const seo = ROUTE_SEO[path] || ROUTE_SEO['/'];

  useEffect(() => {
    // 1. Update Title & Meta Tags
    document.title = seo.title;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', seo.description);

    let metaKw = document.querySelector('meta[name="keywords"]');
    if (!metaKw) {
      metaKw = document.createElement('meta');
      metaKw.setAttribute('name', 'keywords');
      document.head.appendChild(metaKw);
    }
    metaKw.setAttribute('content', seo.keywords);

    // 2. OpenGraph Meta Tags
    const setOgTag = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setOgTag('og:title', seo.title);
    setOgTag('og:description', seo.description);
    setOgTag('og:url', `https://kalishwaricrackers.com${path}`);

    // 3. Inject JSON-LD Schemas dynamically
    const schemas = [localBusinessSchema, websiteSchema];
    if (path === '/' || path === '/shop') {
      schemas.push(faqSchema);
    }

    const breadcrumbs = [
      { name: 'Home', path: '/' }
    ];
    if (path !== '/') {
      const pageName = path.replace('/', '').toUpperCase();
      breadcrumbs.push({ name: pageName, path });
    }
    schemas.push(breadcrumbSchema(breadcrumbs));

    let scriptTag = document.getElementById('json-ld-seo');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-seo';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemas);
  }, [path, seo]);

  return null;
};

export default SEOHead;
