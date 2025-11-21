import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-xl transition-all duration-300 ease-in-out ${className}`}>
      {children}
    </div>
  );
};