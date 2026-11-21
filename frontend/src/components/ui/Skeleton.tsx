import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'card';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
}) => {
  const variantStyles = {
    text: 'h-3.5 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    card: 'rounded-xl h-28',
  };

  return (
    <div
      style={{ width, height }}
      className={`relative overflow-hidden bg-lab-surface/80 border border-lab-borderSubtle ${variantStyles[variant]} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-shimmer" />
    </div>
  );
};
