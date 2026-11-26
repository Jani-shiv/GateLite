import { clsx } from 'clsx';

export interface StatusStampProps {
  children: React.ReactNode;
  variant?: 'approved' | 'denied' | 'pending' | 'entered' | 'exited' | 'left_at_gate';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  rotate?: boolean;
}

const variantClasses = {
  approved: 'bg-mint text-ink',
  denied: 'bg-rose text-ink',
  pending: 'bg-butter text-ink',
  entered: 'bg-sky text-ink',
  exited: 'bg-lilac text-ink',
  left_at_gate: 'bg-butter text-ink',
};

const sizeClasses = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export function StatusStamp({
  children,
  variant = 'approved',
  size = 'md',
  className = '',
  rotate = true,
}: StatusStampProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center rounded-[12px] border-3 border-ink font-bold font-body',
        'shadow-chip',
        variantClasses[variant],
        sizeClasses[size],
        rotate && 'rotate-[-3deg]',
        className,
      )}
    >
      {children}
    </span>
  );
}

export const statusConfig = {
  approved: { label: 'APPROVED', variant: 'approved' as const, icon: 'check' },
  denied: { label: 'DENIED', variant: 'denied' as const, icon: 'x' },
  pending: { label: 'PENDING', variant: 'pending' as const, icon: 'clock' },
  entered: { label: 'ENTERED', variant: 'entered' as const, icon: 'check' },
  exited: { label: 'EXITED', variant: 'exited' as const, icon: 'log-out' },
  left_at_gate: { label: 'LEFT AT GATE', variant: 'left_at_gate' as const, icon: 'package' },
} as const;

export type StatusVariant = keyof typeof statusConfig;