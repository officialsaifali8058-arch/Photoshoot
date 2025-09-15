import React from 'react';
import { ToastMessage } from '../hooks/useToast';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { CloseIcon } from './icons/CloseIcon';

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const isError = toast.type === 'error';
  
  const Icon = isError ? ExclamationTriangleIcon : CheckCircleIcon;
  const iconColor = isError ? 'text-red-400' : 'text-green-400';
  const progressColor = isError ? 'bg-red-500' : 'bg-green-500';

  return (
    <div
      className="toast-enter bg-slate-800 border border-slate-700 rounded-lg shadow-lg flex items-start p-4 w-full max-w-sm overflow-hidden"
      role="alert"
    >
      <div className="flex-shrink-0">
        <Icon className={`h-6 w-6 ${iconColor}`} aria-hidden="true" />
      </div>
      <div className="ml-3 w-0 flex-1">
        <p className="text-sm font-medium text-slate-200">{toast.message}</p>
      </div>
      <div className="ml-4 flex-shrink-0 flex">
        <button
          onClick={() => onRemove(toast.id)}
          className="inline-flex rounded-md text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
        >
          <span className="sr-only">Close</span>
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 ${progressColor} toast-progress`}></div>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
};
