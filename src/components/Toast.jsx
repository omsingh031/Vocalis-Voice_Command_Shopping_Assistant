import { useEffect, useState, useCallback } from 'react';

/**
 * Toast notification system — floating confirmations that auto-dismiss.
 *
 * Usage: <ToastContainer toasts={toasts} onDismiss={removeToast} />
 *
 * Toast shape: { id, message, type: 'success' | 'remove' | 'info' }
 */

function ToastItem({ toast, onDismiss }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: 'ti-check',
    remove: 'ti-trash',
    info: 'ti-info-circle',
  };

  return (
    <div className={`toast ${leaving ? 'is-leaving' : ''}`} role="status" aria-live="polite">
      <div className={`toast-icon ${toast.type}`}>
        <i className={`ti ${icons[toast.type] || icons.info}`} />
      </div>
      <span className="text-sm text-slate-800 dark:text-slate-100 font-semibold">{toast.message}</span>
      <div className="toast-progress" />
    </div>
  );
}

export default function ToastContainer({ toasts, onDismiss }) {
  const handleDismiss = useCallback(
    (id) => onDismiss(id),
    [onDismiss]
  );

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={handleDismiss} />
      ))}
    </div>
  );
}
