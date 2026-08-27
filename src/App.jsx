import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import Blogs from './pages/Blogs';
import Offers from './pages/Offers';
import FloatingWhatsApp from './components/FloatingWhatsApp';

const GlobalStyle = createGlobalStyle`
  :root {
    --gold-primary: #D4AF37;
    --gold-light: #F3E5AB;
    --gold-dark: #AA8222;
    --bg-main: #ffffff;
    --bg-card: #f9f9f9;
    --text-main: #222222;
    --text-muted: #666666;
    --brand-red: #c62828;
    --brand-red-dark: #8e0000;
    
    --font-serif: 'Cinzel', serif;
    --font-sans: 'Outfit', system-ui, sans-serif;
    
    --transition: all 0.3s ease;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: var(--font-sans);
    background-color: var(--bg-main);
    color: var(--text-main);
    line-height: 1.6;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-serif);
    font-weight: 700;
    letter-spacing: 1px;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    font-family: var(--font-sans);
    border: none;
    background: none;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .gold-text {
    background: linear-gradient(to right, var(--gold-light), var(--gold-primary), var(--gold-dark));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--gold-light), var(--gold-primary), var(--gold-dark));
    color: #ffffff;
    padding: 12px 24px;
    border-radius: 4px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: var(--transition);
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
  }

  .btn-outline {
    border: 1px solid var(--gold-primary);
    color: var(--gold-primary);
    padding: 12px 24px;
    border-radius: 4px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: var(--transition);
  }

  .btn-outline:hover {
    background: rgba(212, 175, 55, 0.1);
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(212, 175, 55, 0.2);
    border-radius: 8px;
    padding: 20px;
    transition: var(--transition);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  }

  .glass-card:hover {
    border-color: rgba(212, 175, 55, 0.4);
    transform: translateY(-5px);
  }

  #root {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1;
  }
`;

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    const existing = cartItems.find(item => item.id === product.id);
    if (existing) {
      setCartItems(cartItems.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <GlobalStyle />
      <Navbar cartCount={cartCount} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop cartItems={cartItems} addToCart={addToCart} updateQuantity={updateQuantity} />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/offers" element={<Offers />} />
        </Routes>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </Router>
  );
}

export default App;
