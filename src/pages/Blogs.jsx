import React from 'react';
import styled from 'styled-components';

const PageWrapper = styled.div`
  padding: 4rem 20px;
  min-height: 60vh;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--text-main);
`;

const Blogs = () => {
  return (
    <PageWrapper className="container">
      <Title>Our <span className="gold-text">Blogs</span></Title>
      <div style={{textAlign: 'center', color: 'var(--text-muted)', padding: '3rem'}} className="glass-card">
        <p>Coming soon! Check back later for articles about fireworks safety, celebration tips, and more.</p>
      </div>
    </PageWrapper>
  );
};

export default Blogs;
