import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative group inline-flex items-center justify-center font-medium transition-all duration-150 ease-apple focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500/50 disabled:pointer-events-none disabled:opacity-40 rounded-md active:scale-[0.98] select-none text-xs';

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-sky-500 text-slate-950 hover:bg-sky-400 active:bg-sky-600 font-semibold shadow-sm',
    secondary:
      'bg-[#131b28] hover:bg-[#1a2436] text-slate-200 border border-slate-800 hover:border-slate-700 shadow-subtle',
    accent:
      'bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white shadow-subtle',
    outline:
      'bg-transparent hover:bg-slate-800/60 text-slate-300 border border-slate-700/80',
    ghost:
      'bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200',
    danger:
      'bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/50',
  };

  const sizes: Record<ButtonSize, string> = {
    xs: 'text-xs px-2.5 py-1 gap-1.5 h-7',
    sm: 'text-xs px-3 py-1.5 gap-2 h-8',
    md: 'text-sm px-3.5 py-2 gap-2 h-9',
    lg: 'text-sm px-4.5 py-2.5 gap-2.5 h-10',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-3.5 w-3.5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        icon && (
          <span className="shrink-0 transition-transform duration-150 ease-apple group-hover:scale-105">
            {icon}
          </span>
        )
      )}
      <span>{children}</span>
    </button>
  );
};
