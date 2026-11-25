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
    'relative group inline-flex items-center justify-center font-medium font-mono text-xs transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/60 disabled:pointer-events-none disabled:opacity-40 rounded-sm select-none border';

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-500 font-semibold shadow-sm',
    secondary:
      'bg-[#1C1F22] hover:bg-[#232629] text-[#D9DEE2] border-[#35393D] hover:border-[#454A50]',
    accent:
      'bg-amber-600 hover:bg-amber-500 text-white border-amber-500 font-semibold',
    outline:
      'bg-transparent hover:bg-[#1C1F22] text-[#D9DEE2] border-[#35393D]',
    ghost:
      'bg-transparent hover:bg-[#1C1F22] text-[#929BA3] hover:text-[#D9DEE2] border-transparent',
    danger:
      'bg-red-950/40 hover:bg-red-900/60 text-red-300 border-red-800/60',
  };

  const sizes: Record<ButtonSize, string> = {
    xs: 'text-[11px] px-2 py-0.5 gap-1.5 h-6.5',
    sm: 'text-xs px-2.5 py-1 gap-1.5 h-7.5',
    md: 'text-xs px-3 py-1.5 gap-2 h-8.5',
    lg: 'text-sm px-4 py-2 gap-2 h-9.5',
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
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
