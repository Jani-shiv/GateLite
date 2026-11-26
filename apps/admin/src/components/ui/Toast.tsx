import React, { useEffect, useState, useReducer, useCallback, useContext, createContext } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastProviderProps {
  children: React.ReactNode;
}

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 300;

type ToastAction = { type: 'ADD_TOAST'; toast: Toast } | { type: 'REMOVE_TOAST'; id: string };

interface ToastState {
  toasts: Toast[];
}

const initialState: ToastState = { toasts: [] };

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'ADD_TOAST':
      return { toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };
    case 'REMOVE_TOAST':
      return { toasts: state.toasts.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
}

const ToastContext = createContext<{
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => string;
  dismiss: (id: string) => void;
} | null>(null);

export function ToastProvider({ children }: ToastProviderProps) {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  const toast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9);
    const newToast = { ...toast, id };
    dispatch({ type: 'ADD_TOAST', toast: newToast });
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', id });
  }, []);

  return (
    <ToastContext.Provider value={{ toasts: state.toasts, toast, dismiss }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastContainer() {
  const context = useContext(ToastContext);
  if (!context) return null;
  const { toasts, dismiss } = context;

  return (
    <div className="fixed bottom-6 right-6 z-[500] flex flex-col gap-3 pointer-events-none" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const action = toast.action;
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), TOAST_REMOVE_DELAY);
    }, toast.duration ?? 5000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const typeStyles = {
    success: 'border-mint bg-mint/10',
    error: 'border-rose bg-rose/10',
    warning: 'border-butter bg-butter/10',
    info: 'border-sky bg-sky/10',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-mint" aria-hidden="true" />,
    error: <AlertCircle className="w-5 h-5 text-rose" aria-hidden="true" />,
    warning: <AlertTriangle className="w-5 h-5 text-butter" aria-hidden="true" />,
    info: <Info className="w-5 h-5 text-sky" aria-hidden="true" />,
  };

  if (!visible && exiting) return null;

  return (
    <div
      className={clsx(
        'pointer-events-auto flex items-start gap-3 p-4 w-full max-w-sm',
        'bg-white border-3 border-ink shadow-hero rounded-[12px]',
        typeStyles[toast.type],
        exiting && 'animate-fade-out translate-x-4 opacity-0',
        'animate-slide-in',
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="font-bold font-heading text-ink">{toast.title}</p>
        {toast.message && <p className="mt-1 text-sm font-body text-ink/70">{toast.message}</p>}
        {action && (
          <button
            onClick={() => { action.onClick(); onDismiss(toast.id); }}
            className="mt-2 btn btn-ghost btn-sm text-[toast.type === 'error' ? 'rose' : 'mint']"
          >
            {action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-1 text-ink/40 hover:text-ink hover:bg-ink/5 rounded-[8px] transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}

// Styling for animations
export const toastStyles = `
  @keyframes slide-in {
    from { opacity: 0; transform: translateX(20px) scale(0.95); }
    to { opacity: 1; transform: translateX(0) scale(1); }
  }
  @keyframes fade-out {
    from { opacity: 1; transform: translateX(0) scale(1); }
    to { opacity: 0; transform: translateX(20px) scale(0.95); }
  }
  .animate-slide-in { animation: slide-in 150ms ease-out forwards; }
  .animate-fade-out { animation: fade-out 150ms ease-in forwards; }
`;
