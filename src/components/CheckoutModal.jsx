import React, { useState } from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  position: relative;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #333;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #222;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  input, textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-family: inherit;
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 12px;
  background: #25d366;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.9;
  }
`;

const CheckoutModal = ({ cartItems, totalAmount, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    pincode: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.address || !formData.pincode) {
      alert('Please fill all the details');
      return;
    }

    let message = "Hello Kalishwary Crackers! I would like to place an order:%0A%0A";
    
    message += `*Customer Details:*%0A`;
    message += `Name: ${formData.name}%0A`;
    message += `Mobile: ${formData.mobile}%0A`;
    message += `Address: ${formData.address}%0A`;
    message += `Pincode: ${formData.pincode}%0A%0A`;

    message += `*Order Details:*%0A`;
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - ${item.quantity} x ₹${item.price} = ₹${item.quantity * item.price}%0A`;
    });
    message += `%0A*Total Amount: ₹${totalAmount}*`;
    
    const whatsappNumber = "916380116372"; 
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    onClose();
  };

  return (
    <Overlay>
      <ModalContent>
        <CloseBtn onClick={onClose}><X size={24} /></CloseBtn>
        <Title>Delivery Details</Title>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <label>Mobile Number</label>
            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <label>Delivery Address</label>
            <textarea name="address" rows="3" value={formData.address} onChange={handleChange} required></textarea>
          </FormGroup>
          <FormGroup>
            <label>Pincode</label>
            <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required />
          </FormGroup>
          <SubmitBtn type="submit">Place Order via WhatsApp</SubmitBtn>
        </form>
      </ModalContent>
    </Overlay>
  );
};

export default CheckoutModal;
