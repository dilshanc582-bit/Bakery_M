import React from 'react';
import { useBakery } from '../context/BakeryContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useBakery();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarn = toast.type === 'warning' || toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg border shadow-lg text-xs font-medium transition-all transform animate-in fade-in slide-in-from-bottom-2 ${
              isSuccess
                ? 'bg-stone-900 text-stone-100 border-stone-800'
                : isWarn
                ? 'bg-amber-900 text-amber-50 border-amber-800'
                : 'bg-white text-stone-800 border-stone-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isWarn ? (
                <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span>{toast.text}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
