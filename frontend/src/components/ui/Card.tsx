import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-lab-card border border-lab-border rounded-lg ${
        hoverable ? 'hover:border-neutral-700 hover:bg-lab-cardHover transition-colors cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, icon, className = '' }) => {
  return (
    <div className={`p-4 border-b border-lab-borderSubtle flex items-start justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-2.5">
        {icon && <span className="text-lab-text-secondary">{icon}</span>}
        <div>
          {title && <h3 className="text-sm font-semibold text-lab-text-primary tracking-tight">{title}</h3>}
          {subtitle && <p className="text-xs text-lab-text-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`px-4 py-3 bg-lab-surface/40 border-t border-lab-borderSubtle rounded-b-lg flex items-center justify-between text-xs text-lab-text-muted ${className}`}>
      {children}
    </div>
  );
};
