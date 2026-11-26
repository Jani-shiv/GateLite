import React, { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, leftIcon, rightIcon, className = '', id, ...props },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    const describedBy = clsx(errorId, helperId);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium font-body text-ink mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" aria-hidden="true">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full bg-white border-3 border-ink rounded-[12px] px-4 py-3 text-base font-body text-ink placeholder:text-ink/50',
              'focus:outline-none focus:border-lilac focus:ring-3 focus:ring-ink focus:ring-offset-3 focus:ring-offset-lilac',
              'disabled:bg-ink/5 disabled:cursor-not-allowed',
              'transition-all duration-fast ease-out',
              error && 'border-rose focus:border-tomato focus:ring-tomato',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className,
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedBy || undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40" aria-hidden="true">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-2 text-sm font-body text-rose" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-2 text-sm font-body text-ink/50">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string; helperText?: string }>(
  (
    { label, error, helperText, className = '', id, ...props },
    ref,
  ) => {
    const inputId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium font-body text-ink mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full bg-white border-3 border-ink rounded-[12px] px-4 py-3 text-base font-body text-ink placeholder:text-ink/50 resize-y min-h-[100px]',
            'focus:outline-none focus:border-lilac focus:ring-3 focus:ring-ink focus:ring-offset-3 focus:ring-offset-lilac',
            'disabled:bg-ink/5 disabled:cursor-not-allowed',
            'transition-all duration-fast ease-out',
            error && 'border-rose focus:border-tomato focus:ring-tomato',
            className,
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={clsx(errorId, helperId) || undefined}
          {...props}
        />
        {error && <p id={errorId} className="mt-2 text-sm font-body text-rose" role="alert">{error}</p>}
        {helperText && !error && <p id={helperId} className="mt-2 text-sm font-body text-ink/50">{helperText}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string; helperText?: string; options: { value: string; label: string }[] }>(
  (
    { label, error, helperText, options, className = '', id, ...props },
    ref,
  ) => {
    const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`;
    const errorId = error ? `${selectId}-error` : undefined;
    const helperId = helperText ? `${selectId}-helper` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium font-body text-ink mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            'w-full bg-white border-3 border-ink rounded-[12px] px-4 py-3 text-base font-body text-ink appearance-none pr-12',
            'focus:outline-none focus:border-lilac focus:ring-3 focus:ring-ink focus:ring-offset-3 focus:ring-offset-lilac',
            'disabled:bg-ink/5 disabled:cursor-not-allowed',
            'transition-all duration-fast ease-out',
            error && 'border-rose focus:border-tomato focus:ring-tomato',
            className,
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={clsx(errorId, helperId) || undefined}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink/40" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {error && <p id={errorId} className="mt-2 text-sm font-body text-rose" role="alert">{error}</p>}
        {helperText && !error && <p id={helperId} className="mt-2 text-sm font-body text-ink/50">{helperText}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';