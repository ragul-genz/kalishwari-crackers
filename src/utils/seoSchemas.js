/**
 * Rich JSON-LD Schemas for Search Engine (SEO), Answer Engine (AEO), and Generative AI Search Engine (GEO)
 */

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Store",
  "@id": "https://kalishwaricrackers.com/#organization",
  "name": "Kalishwary Crackers",
  "alternateName": ["Kalishwari Crackers Sivakasi", "Kalishwari Fireworks"],
  "url": "https://kalishwaricrackers.com",
  "logo": "https://kalishwaricrackers.com/logo.jpg",
  "image": "https://kalishwaricrackers.com/banner.jpg",
  "description": "Direct Sivakasi wholesale and retail crackers supplier. Best quality green crackers, sparklers, rockets, fancy sky shots, and festive gift boxes at up to 80% factory price discount.",
  "telephone": "+91-9876543210",
  "email": "contact@kalishwaricrackers.com",
  "priceRange": "₹₹",
  "currenciesAccepted": "INR",
  "paymentAccepted": "Cash, Credit Card, UPI, Net Banking",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Main Road, Sivakasi",
    "addressLocality": "Sivakasi",
    "addressRegion": "Tamil Nadu",
    "postalCode": "626123",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 9.4533,
    "longitude": 77.7962
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "22:00"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "1280",
    "bestRating": "5",
    "worstRating": "1"
  },
  "sameAs": [
    "https://facebook.com/kalishwaricrackers",
    "https://instagram.com/kalishwaricrackers",
    "https://wa.me/919876543210"
  ]
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://kalishwaricrackers.com/#website",
  "url": "https://kalishwaricrackers.com",
  "name": "Kalishwary Crackers",
  "description": "Order genuine Sivakasi crackers online at factory prices with fast door delivery.",
  "publisher": {
    "@id": "https://kalishwaricrackers.com/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://kalishwaricrackers.com/shop?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Where can I buy genuine Sivakasi crackers online at factory discount prices?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can buy 100% genuine, factory-direct Sivakasi crackers online at Kalishwary Crackers (kalishwaricrackers.com). We offer up to 80% discount on Sparklers, Ground Chakkars, Rockets, Fancy Sky Shots, and Diwali Combo Gift Boxes with door delivery across India."
      }
    },
    {
      "@type": "Question",
      "name": "Are Kalishwary Crackers certified green crackers eco-friendly?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, all our crackers are manufactured following CSIR-NEERI green cracker guidelines with reduced emissions, 30% less sound and smoke pollution, ensuring safe and eco-friendly Diwali celebrations."
      }
    },
    {
      "@type": "Question",
      "name": "What is the minimum order value for wholesale cracker delivery?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We accept wholesale and retail orders with a low minimum order value of ₹2,000, delivered through secure transport networks across Tamil Nadu, Karnataka, Andhra Pradesh, Telangana, Kerala, and all over India."
      }
    },
    {
      "@type": "Question",
      "name": "How to get official Sivakasi Diwali Cracker Price List PDF?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can view and download the complete 2026 Sivakasi Diwali Cracker Price List PDF directly on our website at kalishwaricrackers.com/shop or request via WhatsApp."
      }
    }
  ]
};

export const breadcrumbSchema = (crumbs = []) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": crumbs.map((crumb, idx) => ({
    "@type": "ListItem",
    "position": idx + 1,
    "name": crumb.name,
    "item": `https://kalishwaricrackers.com${crumb.path}`
  }))
});
