import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const bgColors = {
    success: 'bg-[#1E4D2B] text-[#FAF7F2] border-[#2E6F40]',
    warning: 'bg-[#C85A32] text-white border-[#E07248]',
    info: 'bg-[#2C221E] text-[#FAF7F2] border-[#4A3B32]'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#86EFAC] shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-[#FDE047] shrink-0" />,
    info: <Info className="w-5 h-5 text-[#93C5FD] shrink-0" />
  };

  return (
    <div
      id="global-toast-notification"
      className="fixed bottom-6 right-6 z-50 max-w-md w-[90vw] sm:w-auto transition-all transform duration-300 ease-out"
    >
      <div
        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-xl border ${bgColors[toast.type]}`}
      >
        {icons[toast.type]}
        <p className="text-sm font-medium pr-2 leading-relaxed">{toast.message}</p>
      </div>
    </div>
  );
};
