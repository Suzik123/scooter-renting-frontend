import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

export default function ToastHost() {
  const toasts = useUIStore((s) => s.toasts);
  const dismiss = useUIStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)] sm:w-auto"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={clsx(
            'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm',
            t.kind === 'success' && 'bg-white border-green-200 text-slate-900',
            t.kind === 'info' && 'bg-white border-slate-200 text-slate-900',
            t.kind === 'error' && 'bg-white border-red-200 text-slate-900',
          )}
          role="status"
        >
          {t.kind === 'success' && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
          {t.kind === 'error' && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />}
          {t.kind === 'info' && <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />}
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => dismiss(t.id)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
