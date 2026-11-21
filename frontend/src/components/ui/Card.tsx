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
      className={`group relative bg-white border border-slate-200/90 rounded-xl transition-all duration-150 ease-apple ${
        hoverable
          ? 'hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-cardHover cursor-pointer'
          : 'shadow-card'
      } ${className}`}
      {...props}
    >
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
    <div className={`p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-2.5">
        {icon && (
          <span className="text-slate-500 transition-colors duration-150 group-hover:text-sky-600">
            {icon}
          </span>
        )}
        <div>
          {title && <h3 className="text-sm font-semibold text-slate-900 tracking-tight">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{subtitle}</p>}
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
    <div className={`px-4 sm:px-5 py-3.5 bg-slate-50/60 border-t border-slate-100 rounded-b-xl flex items-center justify-between text-xs text-slate-500 ${className}`}>
      {children}
    </div>
  );
};
