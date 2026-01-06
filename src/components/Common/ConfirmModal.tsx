import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <div className="flex p-3 rounded-2xl text-[#ff5a00] gap-3">
            <AlertTriangle size={24} className="mt-1.5" />
            <h3 className="text-2xl font-black text-gray-800">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-gray-500 font-medium mb-8 leading-relaxed">{message}</p>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 cursor-pointer py-4 text-gray-500 font-bold hover:bg-gray-200 bg-gray-100 rounded-2xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 bg-[#ff5a00] text-white rounded-2xl font-black shadow-lg shadow-rose-100 hover:bg-[#ff762c] active:scale-95 transition-all cursor-pointer"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};
