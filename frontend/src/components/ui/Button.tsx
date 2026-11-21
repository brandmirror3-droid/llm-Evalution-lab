import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
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
    'relative group inline-flex items-center justify-center font-medium transition-all duration-150 ease-apple focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lab-accent-lime disabled:pointer-events-none disabled:opacity-40 rounded-lg active:scale-[0.98] select-none';

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-lab-text-primary text-lab-bg hover:bg-white active:bg-neutral-200 border border-transparent shadow-subtle hover:shadow-glowLime',
    secondary:
      'bg-lab-card hover:bg-lab-cardHover text-lab-text-primary border border-lab-border hover:border-neutral-700 active:bg-lab-surface',
    outline:
      'bg-transparent hover:bg-lab-surface text-lab-text-secondary hover:text-lab-text-primary border border-lab-border hover:border-neutral-600',
    ghost:
      'bg-transparent hover:bg-lab-surface text-lab-text-secondary hover:text-lab-text-primary',
    danger:
      'bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60',
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
          className="animate-spin h-3.5 w-3.5"
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
