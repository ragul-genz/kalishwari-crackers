import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Tag, Search, X, BookOpen, ArrowRight } from 'lucide-react';
import bannerBg from '../assets/images/sparklers.jpg';
import { getStoredBlogs, BLOG_CATEGORIES } from '../utils/blogManager';

const PageWrapper = styled.div`
  min-height: 80vh;
  background-color: #f8f9fa;
  padding-bottom: 5rem;
`;

const TopBanner = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url(${bannerBg});
  background-size: cover;
  background-position: center;
  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 0 20px;

  h1 {
    font-size: 2.8rem;
    margin-bottom: 10px;
    font-weight: 700;
    font-family: var(--font-serif, 'Cinzel', serif);
    letter-spacing: 2px;
  }

  p {
    font-size: 1rem;
    color: #ddd;
    
    span {
      color: var(--gold-primary, #D4AF37);
      font-weight: 600;
    }
  }

  @media (max-width: 600px) {
    height: 220px;
    h1 {
      font-size: 2rem;
    }
  }
`;

const BlogContainer = styled.div`
  max-width: 1200px;
  margin: 3rem auto 0;
  padding: 0 20px;
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 2.5rem;
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  border: 1px solid #e9ecef;
`;

const CategoriesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const CategoryChip = styled.button`
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid ${props => props.$active ? 'var(--brand-red, #c62828)' : '#dee2e6'};
  background: ${props => props.$active ? 'var(--brand-red, #c62828)' : '#ffffff'};
  color: ${props => props.$active ? '#ffffff' : '#495057'};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: ${props => props.$active ? 'var(--brand-red, #c62828)' : '#f1f3f5'};
    border-color: var(--brand-red, #c62828);
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 20px;
  padding: 6px 14px;
  gap: 8px;
  min-width: 250px;

  input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.88rem;
    width: 100%;
    color: #212529;
  }

  svg {
    color: #868e96;
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const BlogCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
  }
`;

const BlogImage = styled.div`
  height: 210px;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  ${BlogCard}:hover & img {
    transform: scale(1.06);
  }

  .category-badge {
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
  }
`;

const BlogContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const BlogMeta = styled.div`
  font-size: 0.8rem;
  color: #868e96;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 16px;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const BlogTitle = styled.h3`
  font-size: 1.25rem;
  color: #212529;
  margin-bottom: 12px;
  line-height: 1.4;
  font-family: var(--font-serif, 'Cinzel', serif);
  font-weight: 700;
  
  &:hover {
    color: var(--brand-red, #c62828);
    cursor: pointer;
  }
`;

const BlogExcerpt = styled.p`
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 20px;
  flex: 1;
`;

const ReadMoreBtn = styled.button`
  background: transparent;
  border: 1px solid var(--brand-red, #c62828);
  color: var(--brand-red, #c62828);
  padding: 8px 18px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s ease;
  width: fit-content;

  &:hover {
    background: var(--brand-red, #c62828);
    color: white;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  color: #6c757d;

  svg {
    color: #adb5bd;
    margin-bottom: 12px;
  }

  h3 {
    font-size: 1.2rem;
    color: #343a40;
    margin-bottom: 6px;
  }
`;

const ModalBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  @media (max-width: 600px) {
    padding: 12px;
  }
`;

const ModalCard = styled(motion.div)`
  width: 100%;
  max-width: 680px;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: 600px) {
    max-width: 100%;
    max-height: 85vh;
    border-radius: 12px;
  }
`;

const ModalHeader = styled.div`
  position: relative;
  height: 240px;
  
  @media (max-width: 600px) {
    height: 150px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(0, 0, 0, 0.6);
    color: #ffffff;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    transition: background 0.2s;

    @media (max-width: 600px) {
      top: 10px;
      right: 10px;
      width: 30px;
      height: 30px;

      svg {
        width: 16px;
        height: 16px;
      }
    }

    &:hover {
      background: rgba(198, 40, 40, 0.9);
    }
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;

  @media (max-width: 600px) {
    padding: 16px;
  }

  .modal-title {
    font-family: var(--font-serif, 'Cinzel', serif);
    font-size: 1.5rem;
    color: #212529;
    margin-bottom: 12px;

    @media (max-width: 600px) {
      font-size: 1.15rem;
      margin-bottom: 8px;
      line-height: 1.35;
    }
  }

  .modal-meta {
    display: flex;
    gap: 16px;
    font-size: 0.85rem;
    color: #6c757d;
    margin-bottom: 18px;
    padding-bottom: 14px;
    border-bottom: 1px solid #e9ecef;

    @media (max-width: 600px) {
      gap: 10px;
      font-size: 0.74rem;
      flex-wrap: wrap;
      margin-bottom: 12px;
      padding-bottom: 10px;
    }
  }

  .modal-text {
    color: #495057;
    line-height: 1.7;
    font-size: 0.95rem;
    white-space: pre-line;

    @media (max-width: 600px) {
      font-size: 0.84rem;
      line-height: 1.5;
    }
  }
`;

const Blogs = () => {
  const [blogs, setBlogs] = useState(getStoredBlogs());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeBlogModal, setActiveBlogModal] = useState(null);

  useEffect(() => {
    const handleUpdate = () => {
      setBlogs(getStoredBlogs());
    };
    window.addEventListener('blogsUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('focus', handleUpdate);
    document.addEventListener('visibilitychange', handleUpdate);
    return () => {
      window.removeEventListener('blogsUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
      document.removeEventListener('visibilitychange', handleUpdate);
    };
  }, []);

  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (blog.excerpt && blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <PageWrapper>
      <TopBanner>
        <h1>OUR BLOGS & ARTICLES</h1>
        <p>Home / <span>Blogs</span></p>
      </TopBanner>

      <BlogContainer>
        <FilterSection>
          <CategoriesList>
            <CategoryChip 
              $active={selectedCategory === 'All'} 
              onClick={() => setSelectedCategory('All')}
            >
              All Posts
            </CategoryChip>
            {BLOG_CATEGORIES.map(cat => (
              <CategoryChip 
                key={cat} 
                $active={selectedCategory === cat} 
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </CategoryChip>
            ))}
          </CategoriesList>

          <SearchBox>
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search blog articles..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </SearchBox>
        </FilterSection>

        {filteredBlogs.length === 0 ? (
          <EmptyState>
            <BookOpen size={48} />
            <h3>No blog posts found</h3>
            <p>Try searching for a different keyword or selecting another category.</p>
          </EmptyState>
        ) : (
          <BlogGrid>
            {filteredBlogs.map(blog => (
              <BlogCard 
                key={blog.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <BlogImage>
                  <img src={blog.image} alt={blog.title} />
                  <div className="category-badge">{blog.category || 'General'}</div>
                </BlogImage>
                <BlogContent>
                  <BlogMeta>
                    <span><Calendar size={14} /> {blog.date}</span>
                    <span><User size={14} /> {blog.author}</span>
                  </BlogMeta>
                  <BlogTitle onClick={() => setActiveBlogModal(blog)}>{blog.title}</BlogTitle>
                  <BlogExcerpt>{blog.excerpt}</BlogExcerpt>
                  <ReadMoreBtn onClick={() => setActiveBlogModal(blog)}>
                    READ MORE <ArrowRight size={14} />
                  </ReadMoreBtn>
                </BlogContent>
              </BlogCard>
            ))}
          </BlogGrid>
        )}
      </BlogContainer>

      <AnimatePresence>
        {activeBlogModal && (
          <ModalBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveBlogModal(null)}
          >
            <ModalCard
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <img src={activeBlogModal.image} alt={activeBlogModal.title} />
                <button className="close-btn" onClick={() => setActiveBlogModal(null)}>
                  <X size={20} />
                </button>
              </ModalHeader>
              <ModalBody>
                <h2 className="modal-title">{activeBlogModal.title}</h2>
                <div className="modal-meta">
                  <span><Calendar size={14} style={{ marginRight: '4px' }} /> {activeBlogModal.date}</span>
                  <span><User size={14} style={{ marginRight: '4px' }} /> By {activeBlogModal.author}</span>
                  <span><Tag size={14} style={{ marginRight: '4px' }} /> {activeBlogModal.category || 'General'}</span>
                </div>
                <div className="modal-text">
                  {activeBlogModal.content || activeBlogModal.excerpt}
                </div>
              </ModalBody>
            </ModalCard>
          </ModalBackdrop>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default Blogs;
