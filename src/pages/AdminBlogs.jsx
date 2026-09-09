import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit3, Trash2, Eye, X, Upload, Search, BookOpen, Tag, Calendar, User, CheckCircle, AlertTriangle 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { isAdminAuthenticated } from '../utils/authManager';
import { 
  getStoredBlogs, getBlogsAsync, addBlog, updateBlog, deleteBlog, PRESET_BLOG_IMAGES, BLOG_CATEGORIES 
} from '../utils/blogManager';

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

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const TopActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  background: #ffffff;
  padding: 18px 24px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 10px;
    gap: 10px;
    border-radius: 10px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 8px 14px;
  gap: 10px;
  flex: 1;
  min-width: 200px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    width: 100%;
    min-width: 0;
    padding: 7px 10px;
  }

  input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.9rem;
    width: 100%;
    color: #212529;

    @media (max-width: 600px) {
      font-size: 0.82rem;
    }
  }

  svg {
    color: #6c757d;
  }
`;

const AddBlogBtn = styled(motion.button)`
  background: linear-gradient(135deg, var(--brand-red, #c62828), var(--brand-red-dark, #8e0000));
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(198, 40, 40, 0.25);
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;

  &:hover {
    box-shadow: 0 6px 16px rgba(198, 40, 40, 0.35);
    transform: translateY(-2px);
  }

  @media (max-width: 600px) {
    width: 100%;
    justify-content: center;
    padding: 8px 14px;
    font-size: 0.84rem;
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const BlogCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 600px) {
    border-radius: 10px;
  }
`;

const BlogCardImage = styled.div`
  height: 180px;
  position: relative;
  overflow: hidden;

  @media (max-width: 600px) {
    height: 140px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .category-tag {
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgba(198, 40, 40, 0.9);
    color: #ffffff;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    @media (max-width: 600px) {
      font-size: 0.65rem;
      padding: 2px 6px;
      top: 8px;
      left: 8px;
    }
  }
`;

const BlogCardContent = styled.div`
  padding: 18px;
  display: flex;
  flex-direction: column;
  flex: 1;

  @media (max-width: 600px) {
    padding: 12px;
  }

  .meta {
    font-size: 0.78rem;
    color: #868e96;
    margin-bottom: 8px;
    display: flex;
    gap: 14px;

    @media (max-width: 600px) {
      font-size: 0.7rem;
      gap: 10px;
      margin-bottom: 4px;
    }

    span {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }

  h3 {
    font-size: 1.15rem;
    color: #212529;
    font-family: var(--font-serif, 'Cinzel', serif);
    margin-bottom: 8px;
    line-height: 1.4;

    @media (max-width: 600px) {
      font-size: 0.95rem;
      margin-bottom: 4px;
    }
  }

  p {
    font-size: 0.86rem;
    color: #6c757d;
    line-height: 1.5;
    margin-bottom: 16px;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;

    @media (max-width: 600px) {
      font-size: 0.78rem;
      margin-bottom: 8px;
      -webkit-line-clamp: 2;
    }
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f1f3f5;

  @media (max-width: 600px) {
    gap: 6px;
    padding-top: 8px;
  }
`;

const ActionBtn = styled.button`
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid ${props => props.$danger ? '#ffcdd2' : props.$primary ? '#bbdefb' : '#e0e0e0'};
  background: ${props => props.$danger ? '#ffebee' : props.$primary ? '#e3f2fd' : '#f8f9fa'};
  color: ${props => props.$danger ? '#d32f2f' : props.$primary ? '#1976d2' : '#495057'};
  cursor: pointer;
  transition: all 0.2s ease;

  @media (max-width: 600px) {
    padding: 6px 4px;
    font-size: 0.74rem;
    gap: 3px;
  }

  &:hover {
    background: ${props => props.$danger ? '#d32f2f' : props.$primary ? '#1976d2' : '#e0e0e0'};
    color: ${props => props.$danger || props.$primary ? '#ffffff' : '#212529'};
  }
`;

const ModalBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalCard = styled(motion.div)`
  width: 100%;
  max-width: 580px;
  background: #ffffff;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  max-height: 90vh;
  overflow-y: auto;

  .modal-title {
    font-size: 1.3rem;
    color: var(--brand-red, #c62828);
    margin-bottom: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: var(--font-serif, 'Cinzel', serif);
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;

  label {
    font-size: 0.84rem;
    color: #495057;
    font-weight: 600;
  }

  input, select, textarea {
    width: 100%;
    padding: 10px 12px;
    background: #f8f9fa;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #212529;
    outline: none;

    &:focus {
      border-color: var(--brand-red, #c62828);
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(198, 40, 40, 0.1);
    }
  }

  textarea {
    resize: vertical;
    min-height: 90px;
  }
`;

const PresetImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 6px;

  .preset-item {
    border: 2px solid ${props => props.$selected ? 'var(--brand-red, #c62828)' : 'transparent'};
    border-radius: 6px;
    overflow: hidden;
    height: 70px;
    cursor: pointer;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &:hover {
      opacity: 0.9;
    }
  }
`;

const ImagePreviewBox = styled.div`
  width: 100%;
  height: 140px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #dee2e6;
  margin-top: 8px;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

const AdminBlogs = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deletingBlogId, setDeletingBlogId] = useState(null);
  const [viewingBlog, setViewingBlog] = useState(null);
  const [successNotification, setSuccessNotification] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Safety Tips',
    author: 'Admin',
    image: PRESET_BLOG_IMAGES[0].url,
    excerpt: '',
    content: ''
  });

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    const loadBlogs = async () => {
      const data = await getBlogsAsync();
      if (data) setBlogs(data);
    };
    loadBlogs();

    const handleUpdate = async () => {
      const data = await getBlogsAsync();
      if (data) setBlogs(data);
    };
    window.addEventListener('blogsUpdated', handleUpdate);
    return () => window.removeEventListener('blogsUpdated', handleUpdate);
  }, [navigate]);

  const triggerNotify = (title, message) => {
    setSuccessNotification({ id: Date.now(), title, message });
    setTimeout(() => {
      setSuccessNotification(null);
    }, 1700);
  };

  const openAddModal = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      category: 'Safety Tips',
      author: 'Admin',
      image: PRESET_BLOG_IMAGES[0].url,
      excerpt: '',
      content: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      category: blog.category || 'Safety Tips',
      author: blog.author || 'Admin',
      image: blog.image || PRESET_BLOG_IMAGES[0].url,
      excerpt: blog.excerpt || '',
      content: blog.content || ''
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error('Image size should be less than 3MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
        triggerNotify('Image Uploaded', 'Custom image loaded from system!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.excerpt.trim()) {
      toast.error('Title and Summary are required');
      return;
    }

    if (editingBlog) {
      updateBlog(editingBlog.id, formData);
      setIsModalOpen(false);
      triggerNotify('Blog Updated', `"${formData.title}" updated successfully!`);
    } else {
      addBlog(formData);
      setIsModalOpen(false);
      triggerNotify('Blog Published', `"${formData.title}" is now live on Customer Portal!`);
    }
  };

  const confirmDelete = () => {
    if (deletingBlogId) {
      const blogToDelete = blogs.find(b => b.id === deletingBlogId);
      const blogTitle = blogToDelete ? blogToDelete.title : 'Blog post';
      deleteBlog(deletingBlogId);
      setDeletingBlogId(null);
      triggerNotify('Blog Deleted', `"${blogTitle}" deleted successfully!`);
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (b.category && b.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminLayout title="Blogs">
      <PageCardContainer>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <HeaderTitleBox>
            <h3>Blog Posts & Safety Guides</h3>
            <p>Manage and publish articles for customer portal</p>
          </HeaderTitleBox>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <SearchContainer>
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search blogs..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </SearchContainer>

            <AddBlogBtn 
              whileTap={{ scale: 0.96 }}
              onClick={openAddModal}
            >
              <Plus size={18} /> Add New Blog
            </AddBlogBtn>
          </div>
        </div>
        
        <PageContainer>

          {filteredBlogs.length === 0 ? (
            <div style={{ background: '#f8f9fa', padding: '40px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e9ecef', color: '#6c757d' }}>
              <BookOpen size={48} style={{ color: '#adb5bd', marginBottom: '12px' }} />
              <h3>No blogs found</h3>
              <p>Click "Add New Blog" above to create your first article!</p>
            </div>
          ) : (
            <BlogGrid>
              {filteredBlogs.map(blog => (
                <BlogCard 
                  key={blog.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <BlogCardImage>
                    <img src={blog.image} alt={blog.title} />
                    <div className="category-tag">{blog.category || 'General'}</div>
                  </BlogCardImage>
                  <BlogCardContent>
                    <div className="meta">
                      <span><Calendar size={13} /> {blog.date}</span>
                      <span><User size={13} /> {blog.author}</span>
                    </div>
                    <h3>{blog.title}</h3>
                    <p>{blog.excerpt}</p>
                    <CardActions>
                      <ActionBtn onClick={() => setViewingBlog(blog)}>
                        <Eye size={14} /> View
                      </ActionBtn>
                      <ActionBtn $primary onClick={() => openEditModal(blog)}>
                        <Edit3 size={14} /> Edit
                      </ActionBtn>
                      <ActionBtn $danger onClick={() => setDeletingBlogId(blog.id)}>
                        <Trash2 size={14} /> Delete
                      </ActionBtn>
                    </CardActions>
                  </BlogCardContent>
                </BlogCard>
              ))}
            </BlogGrid>
          )}
        </PageContainer>
      </PageCardContainer>

      {/* Add / Edit Blog Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <ModalBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <ModalCard
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="modal-title">
                {editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
                <X size={20} style={{ cursor: 'pointer', color: '#6c757d' }} onClick={() => setIsModalOpen(false)} />
              </h3>

              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <label>Blog Title *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Safety Tips for Diwali Crackers" 
                    value={formData.title} 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                    required 
                  />
                </FormGroup>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <FormGroup>
                    <label>Category</label>
                    <select 
                      value={formData.category} 
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {BLOG_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </FormGroup>

                  <FormGroup>
                    <label>Author</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Admin / Kalishwari Team" 
                      value={formData.author} 
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })} 
                    />
                  </FormGroup>
                </div>

                <FormGroup>
                  <label>Blog Image</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: '9px 16px',
                        background: '#f8f9fa',
                        border: '1px solid #ced4da',
                        borderRadius: '6px',
                        fontSize: '0.86rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      <Upload size={16} /> Choose Image File
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      style={{ display: 'none' }} 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                    />
                  </div>

                  {formData.image && (
                    <ImagePreviewBox>
                      <img src={formData.image} alt="Preview" />
                    </ImagePreviewBox>
                  )}
                </FormGroup>

                <FormGroup>
                  <label>Short Summary / Excerpt *</label>
                  <textarea 
                    rows={2} 
                    placeholder="Brief description displayed on the blog cards..." 
                    value={formData.excerpt} 
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} 
                    required 
                  />
                </FormGroup>

                <FormGroup>
                  <label>Full Content Body</label>
                  <textarea 
                    rows={4} 
                    placeholder="Detailed blog post content..." 
                    value={formData.content} 
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
                  />
                </FormGroup>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      padding: '10px 18px',
                      background: '#f8f9fa',
                      border: '1px solid #ced4da',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    style={{
                      padding: '10px 22px',
                      background: 'var(--brand-red, #c62828)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {editingBlog ? 'Save Changes' : 'Publish Blog'}
                  </button>
                </div>
              </form>
            </ModalCard>
          </ModalBackdrop>
        )}
      </AnimatePresence>

      {/* Viewing Blog Modal */}
      <AnimatePresence>
        {viewingBlog && (
          <ModalBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewingBlog(null)}
          >
            <ModalCard
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <img 
                  src={viewingBlog.image} 
                  alt={viewingBlog.title} 
                  style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '10px' }} 
                />
                <button 
                  onClick={() => setViewingBlog(null)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <h2 style={{ fontFamily: "var(--font-serif, 'Cinzel', serif)", fontSize: '1.4rem', marginBottom: '10px' }}>
                {viewingBlog.title}
              </h2>
              <div style={{ display: 'flex', gap: '14px', fontSize: '0.82rem', color: '#6c757d', marginBottom: '16px' }}>
                <span><Calendar size={13} style={{ marginRight: '4px' }} /> {viewingBlog.date}</span>
                <span><User size={13} style={{ marginRight: '4px' }} /> By {viewingBlog.author}</span>
                <span><Tag size={13} style={{ marginRight: '4px' }} /> {viewingBlog.category}</span>
              </div>
              <div style={{ color: '#495057', fontSize: '0.92rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                {viewingBlog.content || viewingBlog.excerpt}
              </div>
            </ModalCard>
          </ModalBackdrop>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingBlogId && (
          <ModalBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeletingBlogId(null)}
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
                Delete Blog Post?
              </h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '0.88rem', color: '#6c757d', lineHeight: '1.5' }}>
                Are you sure you want to delete this blog post? It will be removed from the Customer Portal as well.
              </p>

              <ModalConfirmActions>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setDeletingBlogId(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="confirm-btn"
                  onClick={confirmDelete}
                >
                  Yes, Delete
                </button>
              </ModalConfirmActions>
            </ModalCard>
          </ModalBackdrop>
        )}
      </AnimatePresence>

      {/* Center Screen Animated Tick Notification Popup */}
      <AnimatedNotification notification={successNotification} onClose={() => setSuccessNotification(null)} />
    </AdminLayout>
  );
};

export default AdminBlogs;
