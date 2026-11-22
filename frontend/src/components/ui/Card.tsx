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
      className={`bg-white border border-slate-200 rounded-lg transition-all duration-150 ease-apple ${
        hoverable
          ? 'hover:border-slate-300 hover:shadow-subtle cursor-pointer'
          : 'shadow-subtle'
      } ${className}`}
      {...props}
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
    <div className={`px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-2 min-w-0">
        {icon && (
          <span className="text-slate-400 shrink-0">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          {title && <h3 className="text-xs font-semibold text-slate-900 tracking-tight truncate">{title}</h3>}
          {subtitle && <p className="text-[11px] text-slate-500 leading-normal truncate">{subtitle}</p>}
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
    <div className={`px-4 py-3 border-t border-slate-100 bg-slate-50/60 rounded-b-lg flex items-center justify-between text-xs text-slate-500 ${className}`}>
      {children}
    </div>
  );
};
