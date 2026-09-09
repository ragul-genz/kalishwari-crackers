import { notifyDataSync } from './syncManager';
import { getStoredProducts } from './productManager';
import { fetchOrdersApi, saveOrderApi, deleteOrderApi } from './api';

const CUSTOMERS_STORAGE_KEY = 'kalishwari_whatsapp_customers';

export const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-1001',
    name: 'Ramesh Kumar',
    phone: '9876543210',
    address: '12, M.G. Road, Near Anna Statue',
    pincode: '625001',
    city: 'Madurai',
    date: 'Sep 08, 2026 10:30 AM',
    itemsCount: 12,
    totalAmount: 3400,
    cartItems: [
      { id: 'Sparklers-1', name: 'Gold Sparklers (10cm)', price: 15, quantity: 10, totalItemPrice: 150 },
      { id: 'Fountains-1', name: 'Flower Pot Big', price: 35, quantity: 4, totalItemPrice: 140 },
      { id: 'Rockets-1', name: 'Sky Rocket (Pack of 10)', price: 40, quantity: 5, totalItemPrice: 200 }
    ]
  },
  {
    id: 'CUST-1002',
    name: 'Priya Sundaram',
    phone: '9443312345',
    address: '45, Gandhi Nagar, 2nd Cross Street',
    pincode: '600028',
    city: 'Chennai',
    date: 'Sep 08, 2026 11:15 AM',
    itemsCount: 8,
    totalAmount: 5200,
    cartItems: [
      { id: 'Night Sky-1', name: '12 Shots Night Sky', price: 80, quantity: 2, totalItemPrice: 160 },
      { id: 'Gift Boxes-1', name: 'Kalishwary Special Gift Box', price: 250, quantity: 2, totalItemPrice: 500 }
    ]
  }
];

export const getCustomersAsync = async () => {
  try {
    const apiOrders = await fetchOrdersApi();
    if (Array.isArray(apiOrders)) {
      if (apiOrders.length === 0) {
        for (const c of INITIAL_CUSTOMERS) {
          await saveOrderApi(c);
        }
        localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
        return INITIAL_CUSTOMERS;
      }
      localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(apiOrders));
      return apiOrders;
    }
  } catch (e) {
    console.warn('API error fetching orders:', e);
  }
  return getStoredCustomers();
};

export const getStoredCustomers = () => {
  try {
    const raw = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    const storeProducts = getStoredProducts();

    let list = [];
    if (raw) {
      list = JSON.parse(raw);
    }

    return list.map(cust => ({
      ...cust,
      cartItems: (cust.cartItems || []).map(item => {
        let img = item.image;
        if (!img) {
          const match = storeProducts.find(p => p.id === item.id || p.name === item.name);
          if (match && match.image) img = match.image;
        }
        return {
          ...item,
          image: img || ''
        };
      })
    }));
  } catch (error) {
    console.error('Error loading stored customers:', error);
    return [];
  }
};

export const saveCustomerOrder = async (customerData) => {
  try {
    const current = getStoredCustomers();

    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const dateOnly = now.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });

    const isoDate = now.toISOString().split('T')[0];

    const totalQty = (customerData.cartItems || []).reduce((acc, item) => acc + item.quantity, 0);

    const newCustomerRecord = {
      id: `CUST-${Date.now().toString().slice(-4)}`,
      name: customerData.name.trim(),
      phone: (customerData.mobile || customerData.phone || '').trim(),
      address: customerData.address.trim(),
      pincode: customerData.pincode.trim(),
      date: formattedDate,
      dateOnly: dateOnly,
      isoDate: isoDate,
      itemsCount: totalQty,
      totalAmount: customerData.totalAmount,
      cartItems: (customerData.cartItems || []).map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        totalItemPrice: item.price * item.quantity,
        image: item.image || ''
      }))
    };

    const updated = [newCustomerRecord, ...current];
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(updated));
    await saveOrderApi(newCustomerRecord);
    notifyDataSync('customersUpdated');
    return newCustomerRecord;
  } catch (error) {
    console.error('Error saving customer order:', error);
    return null;
  }
};

export const deleteCustomerRecord = async (id) => {
  try {
    const current = getStoredCustomers();
    const updated = current.filter(c => c.id !== id);
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(updated));
    await deleteOrderApi(id);
    notifyDataSync('customersUpdated');
    return updated;
  } catch (error) {
    console.error('Error deleting customer record:', error);
    return getStoredCustomers();
  }
};
