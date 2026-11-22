import React from 'react';

interface PageContainerProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'standard' | 'wide' | 'full';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  actions,
  badge,
  children,
  className = '',
  maxWidth = 'standard',
}) => {
  const widthClasses = {
    standard: 'max-w-7xl',
    wide: 'max-w-[1550px]',
    full: 'w-full',
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 py-5 space-y-5 ${widthClasses[maxWidth]} ${className}`}>
      {(title || subtitle || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              {title && (
                <h1 className="text-base sm:text-lg font-semibold tracking-tight text-slate-100">
                  {title}
                </h1>
              )}
              {badge}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-400 leading-normal">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
