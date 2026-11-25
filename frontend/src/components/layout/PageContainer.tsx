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
    wide: 'max-w-[1600px]',
    full: 'w-full',
  };

  return (
    <div className={`mx-auto px-3 sm:px-5 py-3.5 space-y-3.5 ${widthClasses[maxWidth]} ${className}`}>
      {(title || subtitle || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pb-2.5 border-b border-[#35393D]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              {title && (
                <h1 className="text-sm sm:text-base font-semibold tracking-tight text-[#D9DEE2] font-mono uppercase">
                  {title}
                </h1>
              )}
              {badge}
            </div>
            {subtitle && (
              <p className="text-[11px] text-[#929BA3] leading-normal font-sans">
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
