import { X } from 'lucide-react';

export const ToastContainer = ({ children }) => (
  <div className="fixed top-4 right-4 flex flex-col gap-2">
    {children}
  </div>
);

export const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-showSuccess' : type === 'error' ? 'bg-showError' : 'bg-showInfo';
  
  return (
    <div className={` ${bgColor} text-[#fff] p-3 rounded-lg shadow-lg flex items-center justify-between`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 focus:outline-none">
        <X size={18} />
      </button>
    </div>
  );
};