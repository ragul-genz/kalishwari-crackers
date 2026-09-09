import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

export const SkeletonBox = styled.div`
  display: inline-block;
  height: ${props => props.height || '20px'};
  width: ${props => props.width || '100%'};
  border-radius: ${props => props.borderRadius || '6px'};
  background-color: var(--bg-card, #f0f0f0);
  background-image: linear-gradient(
    90deg,
    rgba(220, 220, 220, 0.2) 0px,
    rgba(212, 175, 55, 0.25) 50%,
    rgba(220, 220, 220, 0.2) 100%
  );
  background-size: 200px 100%;
  background-repeat: no-repeat;
  animation: ${shimmer} 1.6s infinite ease-in-out;
`;

export const ProductCardSkeletonWrapper = styled.div`
  background: var(--bg-card, #ffffff);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
`;

export const ProductCardSkeleton = () => (
  <ProductCardSkeletonWrapper>
    <SkeletonBox height="180px" borderRadius="8px" />
    <SkeletonBox height="14px" width="40%" />
    <SkeletonBox height="20px" width="85%" />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
      <SkeletonBox height="24px" width="45%" />
      <SkeletonBox height="36px" width="35%" borderRadius="6px" />
    </div>
  </ProductCardSkeletonWrapper>
);

export const ProductSkeletonGrid = ({ count = 8 }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '20px',
    width: '100%',
    margin: '20px 0'
  }}>
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

export const BlogSkeletonGrid = ({ count = 3 }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
    width: '100%',
    margin: '20px 0'
  }}>
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeletonWrapper key={index}>
        <SkeletonBox height="200px" borderRadius="10px" />
        <SkeletonBox height="16px" width="30%" />
        <SkeletonBox height="22px" width="90%" />
        <SkeletonBox height="14px" width="100%" />
        <SkeletonBox height="14px" width="70%" />
      </ProductCardSkeletonWrapper>
    ))}
  </div>
);

export const PageSkeleton = () => (
  <div style={{
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    minHeight: '70vh'
  }}>
    <SkeletonBox height="60px" width="60%" borderRadius="8px" />
    <SkeletonBox height="20px" width="40%" />
    <ProductSkeletonGrid count={6} />
  </div>
);

export default SkeletonBox;
