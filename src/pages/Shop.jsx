import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import styled from 'styled-components';

const ShopPage = styled.div`
  padding: 4rem 20px;
`;

const PageTitle = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
`;

const CategoryFilters = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
`;

const FilterBtn = styled.button`
  padding: 8px 20px;
  border-radius: 20px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: ${props => props.$active ? '#000' : 'var(--text-muted)'};
  background: ${props => props.$active ? 'var(--gold-primary)' : 'transparent'};
  border-color: ${props => props.$active ? 'var(--gold-primary)' : 'rgba(212, 175, 55, 0.3)'};
  font-weight: 500;
  transition: var(--transition);

  &:hover {
    border-color: var(--gold-primary);
    color: ${props => props.$active ? '#000' : 'var(--text-light)'};
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
`;

const ProductImagePlaceholder = styled.div`
  height: 200px;
  background: linear-gradient(180deg, rgba(26, 26, 26, 1) 0%, rgba(10, 10, 10, 1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const EmojiIcon = styled.span`
  font-size: 5rem;
`;

const ProductDetails = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ProductCategory = styled.span`
  font-size: 0.8rem;
  color: var(--gold-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-family: var(--font-sans);
  font-weight: 600;
`;

const ProductBottom = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProductPrice = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-light);
`;

const AddToCartBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid var(--gold-primary);
  color: var(--gold-primary);
  padding: 8px 12px;
  border-radius: 4px;
  font-weight: 600;
  transition: var(--transition);

  &:hover {
    background: var(--gold-primary);
    color: #000;
  }
`;

const DUMMY_PRODUCTS = [
  { id: 1, name: "Gold Sparklers (10cm)", category: "Sparklers", price: 150, image: "✨" },
  { id: 2, name: "Color Sparklers (15cm)", category: "Sparklers", price: 200, image: "🎇" },
  { id: 3, name: "Flower Pot Big", category: "Fountains", price: 350, image: "🌋" },
  { id: 4, name: "Chakkars Special", category: "Fountains", price: 250, image: "💫" },
  { id: 5, name: "Sky Rocket (Pack of 10)", category: "Rockets", price: 400, image: "🚀" },
  { id: 6, name: "12 Shots Night Sky", category: "Night Sky", price: 800, image: "🎆" },
  { id: 7, name: "30 Shots Multi-color", category: "Night Sky", price: 1500, image: "🎇" },
  { id: 8, name: "Kalishwary Special Gift Box", category: "Gift Boxes", price: 2500, image: "🎁" },
];

const CATEGORIES = ["All", "Sparklers", "Fountains", "Rockets", "Night Sky", "Gift Boxes"];

const Shop = ({ addToCart }) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = activeCategory === "All" 
    ? DUMMY_PRODUCTS 
    : DUMMY_PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <ShopPage className="container">
      <PageTitle>Our <span className="gold-text">Products</span></PageTitle>
      
      <CategoryFilters>
        {CATEGORIES.map(cat => (
          <FilterBtn 
            key={cat} 
            $active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </FilterBtn>
        ))}
      </CategoryFilters>

      <ProductsGrid>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} className="glass-card">
            <ProductImagePlaceholder>
              <EmojiIcon>{product.image}</EmojiIcon>
            </ProductImagePlaceholder>
            <ProductDetails>
              <ProductCategory>{product.category}</ProductCategory>
              <ProductName>{product.name}</ProductName>
              <ProductBottom>
                <ProductPrice>₹{product.price}</ProductPrice>
                <AddToCartBtn onClick={() => addToCart(product)}>
                  <ShoppingCart size={18} /> Add
                </AddToCartBtn>
              </ProductBottom>
            </ProductDetails>
          </ProductCard>
        ))}
      </ProductsGrid>
    </ShopPage>
  );
};

export default Shop;
