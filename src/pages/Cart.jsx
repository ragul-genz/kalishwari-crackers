import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowLeft, MessageCircle } from 'lucide-react';
import styled from 'styled-components';
import CheckoutModal from '../components/CheckoutModal';

const CartPage = styled.div`
  padding: 4rem 20px;
`;

const EmptyCart = styled.div`
  text-align: center;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PageTitle = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
`;

const CartContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const CartItems = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
    position: relative;
  }
`;

const CartItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const CartItemInfo = styled.div`
  flex: 2;
  
  h3 {
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
    font-family: var(--font-sans);
  }
`;

const CartItemPrice = styled.p`
  color: var(--text-muted);
`;

const CartItemCol = styled.div`
  flex: 1;
  text-align: center;
`;

const RemoveBtn = styled.button`
  color: #ef4444;
  padding: 8px;
  transition: var(--transition);

  &:hover {
    transform: scale(1.1);
    color: #dc2626;
  }

  @media (max-width: 600px) {
    position: absolute;
    top: 10px;
    right: 10px;
  }
`;

const CartSummary = styled.div`
  flex: 1;
  padding: 2rem;
  position: sticky;
  top: 100px;
  
  h3 {
    margin-bottom: 1.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 0.5rem;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: var(--text-muted);
`;

const SummaryDivider = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 1.5rem 0;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
`;

const WhatsAppBtn = styled.button`
  width: 100%;
  justify-content: center;
  margin-top: 1.5rem;
  background: linear-gradient(135deg, #25D366, #128C7E);
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
    transform: translateY(-2px);
  }
`;

const ContinueShopping = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  color: var(--text-muted);
  font-size: 0.9rem;
  transition: var(--transition);
  text-decoration: none;

  &:hover {
    color: var(--gold-primary);
  }
`;

const Cart = ({ cartItems, removeFromCart }) => {
  const [showCheckout, setShowCheckout] = useState(false);
  
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleWhatsAppOrder = () => {
    if (cartItems.length === 0) return;
    setShowCheckout(true);
  };

  if (cartItems.length === 0) {
    return (
      <EmptyCart className="container">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any fireworks yet.</p>
        <Link to="/shop" className="btn-primary" style={{ marginTop: '20px' }}>
          Start Shopping
        </Link>
      </EmptyCart>
    );
  }

  return (
    <CartPage className="container">
      <PageTitle>Your <span className="gold-text">Cart</span></PageTitle>
      
      <CartContent>
        <CartItems>
          {cartItems.map((item) => (
            <CartItem key={item.id} className="glass-card">
              <CartItemImage src={item.image} alt={item.name} />
              <CartItemInfo>
                <h3>{item.name}</h3>
                <CartItemPrice>₹{item.price}</CartItemPrice>
              </CartItemInfo>
              <CartItemCol>
                <span>Qty: {item.quantity}</span>
              </CartItemCol>
              <CartItemCol>
                <span>₹{item.price * item.quantity}</span>
              </CartItemCol>
              <RemoveBtn onClick={() => removeFromCart(item.id)}>
                <Trash2 size={20} />
              </RemoveBtn>
            </CartItem>
          ))}
        </CartItems>

        <CartSummary className="glass-card">
          <h3>Order Summary</h3>
          <SummaryRow>
            <span>Subtotal</span>
            <span>₹{totalAmount}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Delivery</span>
            <span>To be calculated</span>
          </SummaryRow>
          <SummaryDivider />
          <TotalRow>
            <span>Total</span>
            <span className="gold-text">₹{totalAmount}</span>
          </TotalRow>
          
          <WhatsAppBtn onClick={handleWhatsAppOrder}>
            <MessageCircle size={20} /> Order via WhatsApp
          </WhatsAppBtn>
          
          <ContinueShopping to="/shop">
            <ArrowLeft size={16} /> Continue Shopping
          </ContinueShopping>
        </CartSummary>
      </CartContent>

      {showCheckout && (
        <CheckoutModal 
          cartItems={cartItems} 
          totalAmount={totalAmount} 
          onClose={() => setShowCheckout(false)} 
        />
      )}
    </CartPage>
  );
};

export default Cart;
