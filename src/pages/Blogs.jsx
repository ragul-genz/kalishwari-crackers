import React from 'react';
import styled from 'styled-components';
import bannerBg from '../assets/images/sparklers.jpg';
import fireworks1 from '../assets/images/rockets.jpg';
import fireworks2 from '../assets/images/fountains.jpg';

const PageWrapper = styled.div`
  min-height: 80vh;
  background-color: #f9f9f9;
  padding-bottom: 5rem;
`;

const TopBanner = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${bannerBg});
  background-size: cover;
  background-position: center;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;

  h1 {
    font-size: 3rem;
    margin-bottom: 10px;
    font-weight: 700;
  }

  p {
    font-size: 1.1rem;
    color: #ddd;
    
    span {
      color: var(--brand-red, #c62828);
    }
  }
`;

const BlogContainer = styled.div`
  max-width: 1200px;
  margin: 4rem auto 0;
  padding: 0 20px;
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2.5rem;
`;

const BlogCard = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
  }
`;

const BlogImage = styled.div`
  height: 220px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  ${BlogCard}:hover & img {
    transform: scale(1.08);
  }
`;

const BlogContent = styled.div`
  padding: 1.5rem;
`;

const BlogMeta = styled.div`
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
`;

const BlogTitle = styled.h3`
  font-size: 1.4rem;
  color: #222;
  margin-bottom: 15px;
  line-height: 1.4;
  
  &:hover {
    color: var(--brand-red, #c62828);
    cursor: pointer;
  }
`;

const BlogExcerpt = styled.p`
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const ReadMoreBtn = styled.button`
  background: transparent;
  border: 1px solid var(--brand-red, #c62828);
  color: var(--brand-red, #c62828);
  padding: 8px 20px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--brand-red, #c62828);
    color: white;
  }
`;

const DUMMY_BLOGS = [
  {
    id: 1,
    title: "How to Celebrate a Safe and Eco-Friendly Diwali",
    date: "October 10, 2026",
    author: "Admin",
    image: fireworks1,
    excerpt: "Discover the best practices for celebrating the festival of lights with your family safely. Tips on handling sparklers, safe distances, and eco-friendly choices."
  },
  {
    id: 2,
    title: "Top 10 Fireworks to Buy for Kids in 2026",
    date: "September 28, 2026",
    author: "Kalishwary Team",
    image: fireworks2,
    excerpt: "Looking for the safest and most colorful crackers for your children? We have curated a list of the top 10 kid-friendly fireworks including flower pots and chakkars."
  },
  {
    id: 3,
    title: "The History of Sivakasi Fireworks Industry",
    date: "September 15, 2026",
    author: "Guest Writer",
    image: bannerBg,
    excerpt: "Take a deep dive into how Sivakasi became the fireworks capital of India. Learn about the legacy and the craftsmanship behind our premium crackers."
  }
];

const Blogs = () => {
  return (
    <PageWrapper>
      <TopBanner>
        <h1>OUR BLOGS</h1>
        <p>Home / <span>Blogs</span></p>
      </TopBanner>

      <BlogContainer>
        <BlogGrid>
          {DUMMY_BLOGS.map(blog => (
            <BlogCard key={blog.id}>
              <BlogImage>
                <img src={blog.image} alt={blog.title} />
              </BlogImage>
              <BlogContent>
                <BlogMeta>
                  <span>{blog.date}</span>
                  <span>By {blog.author}</span>
                </BlogMeta>
                <BlogTitle>{blog.title}</BlogTitle>
                <BlogExcerpt>{blog.excerpt}</BlogExcerpt>
                <ReadMoreBtn>READ MORE</ReadMoreBtn>
              </BlogContent>
            </BlogCard>
          ))}
        </BlogGrid>
      </BlogContainer>
    </PageWrapper>
  );
};

export default Blogs;
