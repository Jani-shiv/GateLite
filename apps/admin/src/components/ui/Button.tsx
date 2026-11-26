import { forwardRef, ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'xl' | 'lg' | 'md' | 'sm';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  justify?: 'start' | 'center' | 'end' | 'between';
  borderColor?: string;
  textColor?: string;
  hoverBg?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      justify = 'center',
      borderColor,
      textColor,
      hoverBg,
      ...props
    },
    ref,
  ) => {
    const baseClasses = `
      inline-flex font-body font-medium transition-all duration-fast ease-out
      border-3 border-ink shadow-card
      active:translate-x-[2px] active:translate-y-[2px] active:shadow-pressed
      hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hero
      focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ink focus-visible:ring-offset-3 focus-visible:ring-offset-lilac
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-card
      ${fullWidth ? 'w-full' : ''}
    `;

    const variantClasses = {
      primary: 'bg-mint text-ink',
      secondary: 'bg-lilac text-ink',
      danger: 'bg-rose text-ink',
      ghost: 'bg-transparent text-ink hover:bg-ink/5',
    };

    const sizeClasses = {
      xl: 'text-xl px-8 py-4 min-h-[56px] min-w-[56px] gap-3',
      lg: 'text-lg px-7 py-3.5 min-h-[52px] min-w-[52px] gap-2.5',
      md: 'text-base px-6 py-3 min-h-[48px] min-w-[48px] gap-2',
      sm: 'text-sm px-4 py-2 min-h-[40px] min-w-[40px] gap-1.5',
    };

    const justifyClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          justifyClasses[justify],
          borderColor ? `border-${borderColor}` : '',
          textColor ? `text-${textColor}` : '',
          hoverBg ? `hover:bg-${hoverBg}` : '',
          className,
        )}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : leftIcon ? (
          <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>
        ) : null}
        <span className="truncate">{children}</span>
        {!loading && rightIcon && <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';

export const ButtonGroup = ({ children, className = '', vertical = false }: { children: React.ReactNode; className?: string; vertical?: boolean }) => (
  <div
    className={clsx(
      vertical ? 'flex flex-col' : 'flex items-center',
      'gap-2',
      className,
    )}
    role="group"
  >
    {children}
  </div>
);