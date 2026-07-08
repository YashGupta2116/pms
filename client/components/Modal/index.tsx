import React from "react";
import ReactDOM from "react-dom";
import Header from "../Header";
import { X } from "lucide-react";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  name: string;
};

const Modal = ({ children, isOpen, onClose, name }: Props) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm transition-all duration-300">
      <div className="dark:bg-dark-secondary w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-stroke-dark dark:text-white transition-all duration-300">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5 dark:border-stroke-dark">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{name}</h2>
          <button
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-dark-tertiary dark:hover:text-white transition-colors"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
