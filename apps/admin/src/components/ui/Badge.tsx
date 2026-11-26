import { clsx } from 'clsx';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'info' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-mint text-ink',
  secondary: 'bg-lilac text-ink',
  danger: 'bg-rose text-ink',
  warning: 'bg-butter text-ink',
  info: 'bg-sky text-ink',
  ghost: 'bg-transparent text-ink',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  leftIcon,
  rightIcon,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-[999px] border-3 border-ink font-bold font-mono',
        'shadow-chip',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {leftIcon && <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>}
    </span>
  );
}

export interface ChipProps extends BadgeProps {
  onRemove?: () => void;
  removable?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Chip({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onRemove,
  removable = false,
  leftIcon,
  rightIcon,
}: ChipProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-[999px] border-3 border-ink font-medium font-body',
        'shadow-chip transition-all duration-fast ease-out',
        'active:translate-x-[2px] active:translate-y-[2px] active:shadow-pressed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {leftIcon && <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>}
      {removable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={clsx(
            'ml-1.5 p-0.5 rounded-full transition-colors',
            'hover:bg-ink/10',
            variant === 'danger' ? 'hover:bg-ink/20' : '',
          )}
          aria-label="Remove"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </span>
  );
}