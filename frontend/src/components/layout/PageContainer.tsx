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
    wide: 'max-w-[1500px]',
    full: 'w-full',
  };

  return (
    <div className={`mx-auto p-4 sm:p-6 lg:p-8 space-y-6 ${widthClasses[maxWidth]} ${className}`}>
      {(title || subtitle || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-lab-borderSubtle">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              {title && (
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-lab-text-primary">
                  {title}
                </h2>
              )}
              {badge}
            </div>
            {subtitle && (
              <p className="text-xs sm:text-sm text-lab-text-muted max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
