import React from 'react';
import { useMaktab } from '../context/MaktabContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, showToast } = useMaktab();

  if (!toastMessage) return null;

  const isSuccess = toastMessage.type === 'success';
  const isError = toastMessage.type === 'error';

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm w-full no-print animate-in fade-in slide-in-from-top-2 duration-200">
      <div
        className={`flex items-center justify-between gap-3 p-3.5 rounded-xl shadow-lg border text-xs font-semibold ${
          isSuccess
            ? 'bg-emerald-900 text-white border-emerald-700 shadow-emerald-950/20'
            : isError
            ? 'bg-rose-900 text-white border-rose-700 shadow-rose-950/20'
            : 'bg-slate-900 text-white border-slate-700 shadow-slate-950/20'
        }`}
      >
        <div className="flex items-center gap-2">
          {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
          {isError && <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />}
          {!isSuccess && !isError && <Info className="w-4 h-4 text-sky-300 shrink-0" />}
          <span>{toastMessage.text}</span>
        </div>
      </div>
    </div>
  );
};
