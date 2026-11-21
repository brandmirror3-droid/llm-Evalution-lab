import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
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
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-lab-card border border-lab-border rounded-xl transition-all duration-200 ease-apple ${
        hoverable
          ? 'hover:-translate-y-1 hover:border-neutral-600 hover:shadow-cardHover hover:bg-lab-cardHover cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {/* Subtle accent hover glow gradient border */}
      {hoverable && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-lab-accent-lime/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
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
    <div className={`p-4 sm:p-5 border-b border-lab-borderSubtle flex items-start justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-2.5">
        {icon && (
          <span className="text-lab-text-secondary transition-transform duration-200 ease-apple group-hover:scale-105 group-hover:text-lab-accent-lime">
            {icon}
          </span>
        )}
        <div>
          {title && <h3 className="text-sm font-semibold text-lab-text-primary tracking-tight">{title}</h3>}
          {subtitle && <p className="text-xs text-lab-text-muted mt-0.5 leading-relaxed">{subtitle}</p>}
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
  return <div className={`p-4 sm:p-5 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`px-4 sm:px-5 py-3.5 bg-lab-surface/40 border-t border-lab-borderSubtle rounded-b-xl flex items-center justify-between text-xs text-lab-text-muted ${className}`}>
      {children}
    </div>
  );
};
