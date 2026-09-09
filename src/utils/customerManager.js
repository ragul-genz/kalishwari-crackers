import { notifyDataSync } from './syncManager';
import { getStoredProducts } from './productManager';
import { fetchOrdersApi, saveOrderApi, deleteOrderApi } from './api';

const CUSTOMERS_STORAGE_KEY = 'kalishwari_whatsapp_customers';

export const INITIAL_CUSTOMERS = [];

export const getCustomersAsync = async () => {
  try {
    const apiOrders = await fetchOrdersApi();
    if (Array.isArray(apiOrders)) {
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

    // Filter out old sample customers (Ramesh Kumar & Priya Sundaram)
    const filtered = list.filter(cust => 
      cust.name !== 'Ramesh Kumar' && 
      cust.name !== 'Priya Sundaram' && 
      cust.id !== 'CUST-1001' && 
      cust.id !== 'CUST-1002'
    );

    if (filtered.length !== list.length) {
      localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(filtered));
    }

    return filtered.map(cust => ({
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
