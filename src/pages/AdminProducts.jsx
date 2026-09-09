import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Edit3, Trash2, FolderPlus, Search, CheckCircle, Upload, Link as LinkIcon 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { isAdminAuthenticated } from '../utils/authManager';
import { 
  getStoredProducts, getProductsAsync, getStoredCategories, getCategoriesAsync, getCategoryImagesMap, getStoredCategoriesObjects, saveCategory, deleteCategory, generateNextProductId, saveSingleProduct, deleteSingleProduct, resolveProductImage 
} from '../utils/productManager';
import sparklersImg from '../assets/images/sparklers.webp';

const PageCardContainer = styled.div`
  background: #ffffff;
  padding: 28px 28px 24px 28px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 12px 8px;
    border-radius: 10px;
  }
`;

const HeaderTitleBox = styled.div`
  h3 {
    color: var(--brand-red, #c62828);
    font-size: 1.35rem;
    font-family: var(--font-serif, 'Cinzel', serif);
    font-weight: 700;
    margin: 0;

    @media (max-width: 600px) {
      font-size: 1rem;
      letter-spacing: 0.5px;
    }
  }

  p {
    color: #6c757d;
    font-size: 0.82rem;
    margin-top: 2px;
    margin-bottom: 0;

    @media (max-width: 600px) {
      font-size: 0.74rem;
    }
  }
`;

const ModalBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalCard = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 14px;
  padding: 24px;
  color: #212529;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  max-height: 90vh;
  overflow-y: auto;

  h3 {
    font-size: 1.3rem;
    color: var(--brand-red, #c62828);
    margin-bottom: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;

    label {
      font-size: 0.82rem;
      color: #495057;
      font-weight: 600;
    }

    input, select {
      width: 100%;
      padding: 10px 12px;
      background: #f8f9fa;
      border: 1px solid #ced4da;
      border-radius: 6px;
      color: #212529;
      font-size: 0.9rem;
      outline: none;

      &:focus {
        border-color: var(--brand-red, #c62828);
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(198, 40, 40, 0.1);
      }

      option {
        background: #ffffff;
        color: #212529;
      }
    }
  }

  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;

  button.cancel {
    background: #e9ecef;
    color: #495057;
    padding: 9px 16px;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 500;

    @media (max-width: 600px) {
      padding: 6px 12px;
      font-size: 0.76rem;
    }

    &:hover {
      background: #dee2e6;
      color: #212529;
    }
  }

  button.save {
    background: linear-gradient(135deg, var(--brand-red, #c62828), var(--brand-red-dark, #8e0000));
    color: #ffffff;
    padding: 9px 20px;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;

    @media (max-width: 600px) {
      padding: 6px 12px;
      font-size: 0.76rem;
    }

    &:hover {
      background: linear-gradient(135deg, #d32f2f, var(--brand-red, #c62828));
    }
  }
`;

const ModalConfirmActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;

  button.cancel-btn {
    flex: 1;
    padding: 10px 16px;
    border-radius: 8px;
    border: 1px solid #ced4da;
    background: #f8f9fa;
    color: #495057;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;

    @media (max-width: 600px) {
      padding: 7px 10px;
      font-size: 0.76rem;
      border-radius: 6px;
    }
  }

  button.confirm-btn {
    flex: 1;
    padding: 10px 16px;
    border-radius: 8px;
    border: none;
    background: linear-gradient(135deg, #d32f2f, #c62828);
    color: #ffffff;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);

    @media (max-width: 600px) {
      padding: 7px 10px;
      font-size: 0.76rem;
      border-radius: 6px;
    }
  }
`;

const HeaderAddCategoryBtn = styled.button`
  background: #ffffff;
  border: 1px solid #ced4da;
  color: #495057;
  padding: 9px 16px;
  border-radius: 6px;
  font-size: 0.88rem;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
    border-color: #adb5bd;
  }

  @media (max-width: 600px) {
    padding: 6px 10px;
    font-size: 0.76rem;
    gap: 4px;
    border-radius: 6px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const HeaderAddProductBtn = styled.button`
  background: var(--brand-red, #c62828);
  color: #fff;
  padding: 9px 18px;
  border-radius: 6px;
  font-size: 0.88rem;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #a71d1d;
  }

  @media (max-width: 600px) {
    padding: 6px 12px;
    font-size: 0.76rem;
    gap: 4px;
    border-radius: 6px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const CategoryPillsBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f3f5;

  @media (max-width: 600px) {
    gap: 5px;
    margin-bottom: 12px;
    padding-bottom: 6px;
  }
`;

const CategoryPillButton = styled.button`
  padding: 7px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: ${props => props.$isSelected ? '1px solid var(--brand-red, #c62828)' : '1px solid #ced4da'};
  background: ${props => props.$isSelected ? 'var(--brand-red, #c62828)' : '#ffffff'};
  color: ${props => props.$isSelected ? '#ffffff' : '#495057'};
  transition: all 0.2s ease;
  white-space: nowrap;

  @media (max-width: 600px) {
    padding: 5px 10px;
    font-size: 0.74rem;
    border-radius: 14px;
  }
`;

const CategoryPillItem = styled.div`
  padding: 7px 12px 7px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: ${props => props.$isSelected ? '1px solid var(--brand-red, #c62828)' : '1px solid #ced4da'};
  background: ${props => props.$isSelected ? 'var(--brand-red, #c62828)' : '#ffffff'};
  color: ${props => props.$isSelected ? '#ffffff' : '#495057'};
  transition: all 0.2s ease;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 600px) {
    padding: 4px 9px;
    font-size: 0.74rem;
    gap: 4px;
    border-radius: 14px;

    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

const TableEditBtn = styled.button`
  background: #f1f3f5;
  border: 1px solid #ced4da;
  color: #495057;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    padding: 4px;
    border-radius: 4px;

    svg {
      width: 13px;
      height: 13px;
    }
  }
`;

const TableDeleteBtn = styled.button`
  background: #ffebee;
  border: 1px solid #ffcdd2;
  color: #d32f2f;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    padding: 4px;
    border-radius: 4px;

    svg {
      width: 13px;
      height: 13px;
    }
  }
`;

const NotificationBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const NotificationBoxCard = styled(motion.div)`
  width: 100%;
  max-width: 380px;
  background: #ffffff;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const NotificationBadge = styled(motion.div)`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SVGPathDrawingCheckmark = () => {
  return (
    <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
      <motion.svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        initial="hidden"
        animate="visible"
        style={{ overflow: 'visible' }}
      >
        {/* Soft Background Circle Fill */}
        <motion.circle
          cx="32"
          cy="32"
          r="27"
          fill="#e8f5e9"
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: { 
              scale: [0, 1.1, 1], 
              opacity: 1,
              transition: { delay: 0.6, duration: 0.4, ease: "easeOut" }
            }
          }}
        />

        {/* Outer Circular Path Stroke Drawing */}
        <motion.circle
          cx="32"
          cy="32"
          r="27"
          fill="none"
          stroke="#2e7d32"
          strokeWidth="3.5"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { pathLength: { duration: 0.65, ease: "easeInOut" }, opacity: { duration: 0.1 } }
            }
          }}
        />

        {/* Checkmark Path Drawing Inside Circle */}
        <motion.path
          d="M20 33 L28 41 L44 23"
          fill="none"
          stroke="#2e7d32"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { delay: 0.55, pathLength: { duration: 0.45, ease: "easeOut" }, opacity: { delay: 0.55, duration: 0.05 } }
            }
          }}
        />
      </motion.svg>
    </div>
  );
};

const AnimatedNotification = ({ notification, onClose }) => {
  if (!notification) return null;

  return (
    <AnimatePresence>
      <NotificationBackdrop
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <NotificationBoxCard
          key={notification.id}
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 450, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
        >
          <SVGPathDrawingCheckmark />

          <h3 style={{
            fontFamily: "var(--font-serif, 'Cinzel', serif)",
            fontSize: '1.2rem',
            fontWeight: '700',
            color: '#212529',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            margin: '0 0 8px 0'
          }}>
            {notification.title}
          </h3>

          <p style={{
            fontSize: '0.9rem',
            color: '#6c757d',
            lineHeight: '1.5',
            margin: 0
          }}>
            {notification.message}
          </p>
        </NotificationBoxCard>
      </NotificationBackdrop>
    </AnimatePresence>
  );
};

const AnimatedConfirmModal = ({ confirmData, onConfirm, onCancel }) => {
  if (!confirmData) return null;

  return (
    <AnimatePresence>
      <ModalBackdrop 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onCancel}
        style={{ zIndex: 9990 }}
      >
        <ModalCard 
          initial={{ scale: 0.85, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 420, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: '400px', textAlign: 'center', padding: '28px 24px', background: '#ffffff' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#ffebee',
              border: '1px solid #ffcdd2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}
          >
            <Trash2 size={26} color="#d32f2f" />
          </motion.div>

          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#212529', justifyContent: 'center' }}>
            {confirmData.title || 'Are you sure?'}
          </h3>
          <p style={{ margin: '0 0 24px 0', fontSize: '0.88rem', color: '#6c757d', lineHeight: '1.5' }}>
            {confirmData.message}
          </p>

          <ModalConfirmActions>
            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="confirm-btn"
              onClick={onConfirm}
            >
              Yes, Delete
            </button>
          </ModalConfirmActions>
        </ModalCard>
      </ModalBackdrop>
    </AnimatePresence>
  );
};

const AdminProducts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const [productsList, setProductsList] = useState(getStoredProducts());
  const [categoriesList, setCategoriesList] = useState(getStoredCategories());
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Animated Custom Notification & Confirm Modal State
  const [notification, setNotification] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const categoryDropdownRef = useRef(null);

  const triggerNotify = (title, message) => {
    setNotification({ id: Date.now(), title, message });
    setTimeout(() => {
      setNotification(null);
    }, 1700);
  };

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState(categoriesList[0] || 'Sparklers');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formRegularPrice, setFormRegularPrice] = useState('');
  const [formStock, setFormStock] = useState('In Stock');
  const [formImage, setFormImage] = useState(sparklersImg);
  const [customImageInput, setCustomImageInput] = useState('');
  const [uploadedImage, setUploadedImage] = useState('');
  const [standaloneCategoryInput, setStandaloneCategoryInput] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryUploadedImage, setCategoryUploadedImage] = useState('');
  const [categoryCustomImageInput, setCategoryCustomImageInput] = useState('');

  const handleCategoryFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategoryUploadedImage(reader.result);
        setCategoryCustomImageInput('');
        triggerNotify('Image Uploaded', 'Category image loaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const prods = await getProductsAsync();
      const cats = await getCategoriesAsync();
      if (prods) setProductsList(prods);
      if (cats) setCategoriesList(cats);
    };
    loadData();

    const handleUpdate = async () => {
      const prods = await getProductsAsync();
      const cats = await getCategoriesAsync();
      if (prods) setProductsList(prods);
      if (cats) setCategoriesList(cats);
    };
    window.addEventListener('productsUpdated', handleUpdate);
    return () => window.removeEventListener('productsUpdated', handleUpdate);
  }, []);

  // Click outside category search dropdown listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setCustomImageInput('');
        triggerNotify('Image Uploaded', 'Custom image loaded from system!');
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    const defaultCat = categoriesList[0] || 'Sparklers';
    setFormCategory(defaultCat);
    setCategorySearchQuery(defaultCat);
    setIsCategoryDropdownOpen(false);
    setCustomCategoryName('');
    setFormPrice('');
    setFormRegularPrice('');
    setFormStock('In Stock');
    setFormImage(sparklersImg);
    setCustomImageInput('');
    setUploadedImage('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setCategorySearchQuery(product.category);
    setIsCategoryDropdownOpen(false);
    setCustomCategoryName('');
    setFormPrice(product.price);
    setFormRegularPrice(product.regularPrice);
    setFormStock(product.stock || 'In Stock');
    setFormImage(product.image);
    setUploadedImage(typeof product.image === 'string' && product.image.startsWith('data:image') ? product.image : '');
    setCustomImageInput(typeof product.image === 'string' && product.image.startsWith('http') ? product.image : '');
    setIsModalOpen(true);
  };

  const handleDeleteProductClick = (id, name) => {
    setConfirmData({
      type: 'product',
      target: { id, name },
      title: 'Delete Product',
      message: `Are you sure you want to delete product "${name}"?`
    });
  };

  const handleCategoryDeleteClick = (e, cat) => {
    e.stopPropagation();
    setConfirmData({
      type: 'category',
      target: cat,
      title: 'Delete Category',
      message: `Are you sure you want to delete category "${cat}"?`
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmData) return;

    if (confirmData.type === 'category') {
      const cat = confirmData.target;
      await deleteCategory(cat);
      if (selectedCategoryFilter === cat) {
        setSelectedCategoryFilter('All');
      }
      triggerNotify('Category Deleted', `Category "${cat}" deleted successfully!`);
    } else if (confirmData.type === 'product') {
      const { id, name } = confirmData.target;
      await deleteSingleProduct(id);
      setProductsList(getStoredProducts());
      triggerNotify('Product Deleted', `Product "${name}" deleted successfully!`);
    }

    setConfirmData(null);
  };

  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setStandaloneCategoryInput('');
    setCategoryUploadedImage('');
    setCategoryCustomImageInput('');
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (catName, e) => {
    e.stopPropagation();
    setEditingCategory(catName);
    setStandaloneCategoryInput(catName);
    const imgMap = getCategoryImagesMap();
    const existingImg = imgMap[catName] || '';
    setCategoryUploadedImage(existingImg.startsWith('data:image') ? existingImg : '');
    setCategoryCustomImageInput(existingImg.startsWith('http') ? existingImg : '');
    setIsCategoryModalOpen(true);
  };

  const handleCreateCategorySubmit = async (e) => {
    e.preventDefault();
    if (!standaloneCategoryInput.trim()) {
      toast.error('Please enter category name');
      return;
    }
    const newCat = standaloneCategoryInput.trim();
    const categoryImage = categoryUploadedImage || categoryCustomImageInput.trim() || resolveProductImage('', newCat);
    
    await saveCategory(newCat, categoryImage);
    setCategoriesList(getStoredCategories());
    setStandaloneCategoryInput('');
    setCategoryUploadedImage('');
    setCategoryCustomImageInput('');
    setIsCategoryModalOpen(false);
    triggerNotify(editingCategory ? 'Category Updated' : 'Category Created', `Category "${newCat}" saved successfully!`);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    if (!formName.trim() || !formPrice || !formRegularPrice) {
      toast.error('Please enter name, offer price, and regular price');
      return;
    }

    const finalCategory = categorySearchQuery.trim() || formCategory;

    if (!finalCategory) {
      toast.error('Please select or enter a valid category name');
      return;
    }

    if (!categoriesList.includes(finalCategory)) {
      await saveCategory(finalCategory);
      setCategoriesList(getStoredCategories());
    }

    const imageToUse = uploadedImage 
      ? uploadedImage 
      : (customImageInput.trim() ? customImageInput.trim() : formImage);

    let updatedList;
    let targetProduct;
    if (editingProduct) {
      // Edit existing product
      targetProduct = { 
        ...editingProduct, 
        name: formName.trim(), 
        category: finalCategory, 
        price: Number(formPrice), 
        regularPrice: Number(formRegularPrice), 
        stock: formStock,
        image: imageToUse,
        isOffer: true
      };
      triggerNotify('Product Updated', `${formName.trim()} details updated successfully!`);
    } else {
      // Add new product
      const generatedId = generateNextProductId(finalCategory, productsList);
      targetProduct = {
        id: generatedId,
        name: formName.trim(),
        category: finalCategory,
        price: Number(formPrice),
        regularPrice: Number(formRegularPrice),
        stock: formStock,
        image: imageToUse,
        isOffer: true
      };
      triggerNotify('New Product Added', `${formName.trim()} added successfully! Now visible in Customer Shop Page.`);
    }

    saveSingleProduct(targetProduct).then(() => {
      setProductsList(getStoredProducts());
    });
    setIsModalOpen(false);
  };

  const displayedProducts = (selectedCategoryFilter === 'All'
    ? productsList
    : productsList.filter(p => p.category === selectedCategoryFilter)
  ).slice().sort((a, b) => {
    const numA = typeof a.id === 'number' ? a.id : parseInt(String(a.id).replace(/\D/g, ''), 10) || 0;
    const numB = typeof b.id === 'number' ? b.id : parseInt(String(b.id).replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

  return (
    <AdminLayout title="Products">
      <PageCardContainer>
        {/* Animated Success Notification */}
        <AnimatedNotification notification={notification} onClose={() => setNotification(null)} />

        {/* Animated Custom Confirmation Modal */}
        <AnimatedConfirmModal 
          confirmData={confirmData} 
          onConfirm={handleConfirmDelete} 
          onCancel={() => setConfirmData(null)} 
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <HeaderTitleBox>
            <h3>Product Inventory ({productsList.length})</h3>
            <p>Manage all shop products, categories & store integrations</p>
          </HeaderTitleBox>
          <div style={{ display: 'flex', gap: '8px' }}>
            <HeaderAddCategoryBtn onClick={openAddCategoryModal}>
              <FolderPlus size={16} /> Add Category
            </HeaderAddCategoryBtn>
            <HeaderAddProductBtn onClick={openAddModal}>
              <Plus size={16} /> Add Product
            </HeaderAddProductBtn>
          </div>
        </div>

        {/* Category Filter Buttons Bar */}
        <CategoryPillsBar>
          <CategoryPillButton 
            $isSelected={selectedCategoryFilter === 'All'}
            onClick={() => setSelectedCategoryFilter('All')}
          >
            All ({productsList.length})
          </CategoryPillButton>
          {categoriesList.map((cat) => {
            const count = productsList.filter(p => p.category === cat).length;
            const isSelected = selectedCategoryFilter === cat;
            return (
              <CategoryPillItem 
                key={cat}
                $isSelected={isSelected}
                onClick={() => setSelectedCategoryFilter(cat)}
              >
                <span>{cat} ({count})</span>
                <Edit3
                  size={13}
                  style={{
                    cursor: 'pointer',
                    opacity: 0.85,
                    color: isSelected ? '#ffffff' : '#c62828'
                  }}
                  onClick={(e) => openEditCategoryModal(cat, e)}
                  title={`Edit ${cat} category image & details`}
                />
                <Trash2 
                  size={13} 
                  style={{ 
                    cursor: 'pointer', 
                    opacity: 0.85,
                    color: isSelected ? '#ffffff' : '#d32f2f'
                  }}
                  onClick={(e) => handleCategoryDeleteClick(e, cat)}
                  title={`Delete ${cat} category`}
                />
              </CategoryPillItem>
            );
          })}
        </CategoryPillsBar>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e9ecef', color: 'var(--brand-red, #c62828)', fontWeight: '700' }}>
                <th style={{ padding: '12px 10px' }}>Image</th>
                <th style={{ padding: '12px 10px' }}>Product Name</th>
                <th style={{ padding: '12px 10px' }}>Category</th>
                <th style={{ padding: '12px 10px' }}>Price</th>
                <th style={{ padding: '12px 10px' }}>Stock</th>
                <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#6c757d' }}>
                    No products found in "{selectedCategoryFilter}" category.
                  </td>
                </tr>
              ) : (
                displayedProducts.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                    <td style={{ padding: '10px' }}>
                      <img 
                        src={resolveProductImage(product.image, product.category)} 
                        alt={product.name} 
                        style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #dee2e6', background: '#f8f9fa' }} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = resolveProductImage('', product.category);
                        }}
                      />
                    </td>
                    <td style={{ padding: '10px', fontWeight: '600', color: '#212529' }}>
                      {product.name}
                      <div style={{ fontSize: '0.75rem', color: '#868e96', fontWeight: 'normal' }}>ID: {product.id}</div>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', border: '1px solid #c8e6c9', fontWeight: '600' }}>
                        {product.category}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ color: '#212529', fontWeight: '700' }}>₹{product.price}</span>
                      <span style={{ color: '#adb5bd', textDecoration: 'line-through', marginLeft: '6px', fontSize: '0.8rem' }}>₹{product.regularPrice}</span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ color: '#2e7d32', background: '#e8f5e9', padding: '3px 8px', borderRadius: '4px', fontSize: '0.78rem', border: '1px solid #c8e6c9', fontWeight: '600' }}>
                        {product.stock || 'In Stock'}
                      </span>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <TableEditBtn 
                          onClick={() => openEditModal(product)}
                          title="Edit Product"
                        >
                          <Edit3 size={15} />
                        </TableEditBtn>
                        <TableDeleteBtn 
                          onClick={() => handleDeleteProductClick(product.id, product.name)}
                          title="Delete Product"
                        >
                          <Trash2 size={15} />
                        </TableDeleteBtn>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Standalone Add/Edit Category Modal */}
        <AnimatePresence>
          {isCategoryModalOpen && (
            <ModalBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ModalCard initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
                <h3>
                  {editingCategory ? `Edit Category: ${editingCategory}` : 'Create New Category'}
                  <X size={20} style={{ cursor: 'pointer', color: '#6c757d' }} onClick={() => setIsCategoryModalOpen(false)} />
                </h3>
                <ModalForm onSubmit={handleCreateCategorySubmit}>
                  <div className="field-group">
                    <label>Category Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Ground Chakkars, Multi Shot, etc." 
                      value={standaloneCategoryInput} 
                      onChange={(e) => setStandaloneCategoryInput(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="field-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Upload size={14} color="var(--brand-red, #c62828)" /> Upload Category Image (Device)
                    </label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleCategoryFileUpload} 
                      style={{ background: '#ffffff', cursor: 'pointer', padding: '6px' }}
                    />
                    {categoryUploadedImage && (
                      <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img 
                          src={categoryUploadedImage} 
                          alt="Category Preview" 
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '2px solid var(--brand-red, #c62828)' }} 
                        />
                        <span style={{ fontSize: '0.8rem', color: '#2e7d32', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={14} color="#2e7d32" /> Custom Image Ready
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="field-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <LinkIcon size={14} color="var(--brand-red, #c62828)" /> Or Enter Category Image URL (Optional)
                    </label>
                    <input 
                      type="url" 
                      placeholder="https://example.com/category-image.jpg" 
                      value={categoryCustomImageInput} 
                      onChange={(e) => { setCategoryCustomImageInput(e.target.value); if(e.target.value) setCategoryUploadedImage(''); }}
                    />
                  </div>

                  <ModalActions>
                    <button type="button" className="cancel" onClick={() => setIsCategoryModalOpen(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="save">
                      {editingCategory ? 'Save Category Changes' : 'Create Category'}
                    </button>
                  </ModalActions>
                </ModalForm>
              </ModalCard>
            </ModalBackdrop>
          )}
        </AnimatePresence>

        {/* Add / Edit Product Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <ModalBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ModalCard initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
                <h3>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                  <X size={20} style={{ cursor: 'pointer', color: '#6c757d' }} onClick={() => setIsModalOpen(false)} />
                </h3>

                <ModalForm onSubmit={handleSaveProduct}>
                  <div className="field-group">
                    <label>Product Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 50 Shots Multi Sky Shot" 
                      value={formName} 
                      onChange={(e) => setFormName(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="two-col">
                    <div className="field-group" style={{ position: 'relative' }} ref={categoryDropdownRef}>
                      <label>Category * (Search or Select)</label>
                      <div style={{ position: 'relative' }}>
                        <input 
                          type="text" 
                          placeholder="Search or type category..." 
                          value={categorySearchQuery} 
                          onChange={(e) => {
                            setCategorySearchQuery(e.target.value);
                            setFormCategory(e.target.value);
                            setIsCategoryDropdownOpen(true);
                          }}
                          onFocus={() => setIsCategoryDropdownOpen(true)}
                          style={{ paddingLeft: '32px', paddingRight: '28px' }}
                        />
                        <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8c8c8c' }} />
                        {categorySearchQuery && (
                          <X 
                            size={15} 
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#8c8c8c' }}
                            onClick={() => {
                              setCategorySearchQuery('');
                              setFormCategory(categoriesList[0] || 'Sparklers');
                              setIsCategoryDropdownOpen(true);
                            }} 
                          />
                        )}
                      </div>

                      {isCategoryDropdownOpen && (
                        <div 
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: '#ffffff',
                            border: '1px solid #ced4da',
                            borderRadius: '6px',
                            maxHeight: '160px',
                            overflowY: 'auto',
                            boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                            marginTop: '4px',
                            zIndex: 100
                          }}
                        >
                          {categoriesList
                            .filter(cat => cat.toLowerCase().includes(categorySearchQuery.toLowerCase()))
                            .map(cat => (
                              <div 
                                key={cat}
                                onClick={() => {
                                  setFormCategory(cat);
                                  setCategorySearchQuery(cat);
                                  setIsCategoryDropdownOpen(false);
                                }}
                                style={{
                                  padding: '8px 12px',
                                  cursor: 'pointer',
                                  fontSize: '0.88rem',
                                  background: formCategory === cat ? '#ffebee' : '#ffffff',
                                  color: formCategory === cat ? 'var(--brand-red, #c62828)' : '#212529',
                                  fontWeight: formCategory === cat ? '600' : '400',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}
                              >
                                <span>{cat}</span>
                                {formCategory === cat && <CheckCircle size={14} color="var(--brand-red, #c62828)" />}
                              </div>
                            ))
                          }

                          {categorySearchQuery.trim() && !categoriesList.some(c => c.toLowerCase() === categorySearchQuery.trim().toLowerCase()) && (
                            <div 
                              onClick={() => {
                                const newCat = categorySearchQuery.trim();
                                setFormCategory(newCat);
                                setIsCategoryDropdownOpen(false);
                              }}
                              style={{
                                padding: '9px 12px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                background: '#f8f9fa',
                                color: 'var(--brand-red, #c62828)',
                                fontWeight: '600',
                                borderTop: '1px solid #e9ecef',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <Plus size={14} /> Create category "{categorySearchQuery.trim()}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="field-group">
                      <label>Stock Status</label>
                      <select value={formStock} onChange={(e) => setFormStock(e.target.value)}>
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>
                  </div>

                  <div className="two-col">
                    <div className="field-group">
                      <label>Offer Price (₹) *</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 350" 
                        value={formPrice} 
                        onChange={(e) => setFormPrice(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="field-group">
                      <label>Original Price (₹) *</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 1500" 
                        value={formRegularPrice} 
                        onChange={(e) => setFormRegularPrice(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>

                  <div className="field-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Upload size={14} color="var(--brand-red, #c62828)" /> Upload Image from PC / Device
                    </label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      style={{ background: '#ffffff', cursor: 'pointer', padding: '6px' }}
                    />
                    {uploadedImage && (
                      <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img 
                          src={uploadedImage} 
                          alt="Upload Preview" 
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '2px solid var(--brand-red, #c62828)' }} 
                        />
                        <span style={{ fontSize: '0.8rem', color: '#2e7d32', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={14} color="#2e7d32" /> Custom Image Ready
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="field-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <LinkIcon size={14} color="var(--brand-red, #c62828)" /> Or Enter Image URL (Optional)
                    </label>
                    <input 
                      type="url" 
                      placeholder="https://example.com/image.jpg" 
                      value={customImageInput} 
                      onChange={(e) => { setCustomImageInput(e.target.value); if(e.target.value) setUploadedImage(''); }}
                    />
                  </div>

                  <ModalActions>
                    <button type="button" className="cancel" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="save">
                      {editingProduct ? 'Update Product' : 'Add to Customer Portal'}
                    </button>
                  </ModalActions>
                </ModalForm>
              </ModalCard>
            </ModalBackdrop>
          )}
        </AnimatePresence>
      </PageCardContainer>
    </AdminLayout>
  );
};

export default AdminProducts;
