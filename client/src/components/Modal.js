import React, { useState } from 'react';

function Modal({ isOpen, onClose, onConfirm, title, children }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
      onClose(); 
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

      <div className="p-8 z-10 min-w-[30%] relative bg-[#191919]">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        {children} 

        <div className="flex justify-end mt-6 gap-4">
          <button
            className="px-4 py-2 hover:underline"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-[#e50914] disabled:cursor-not-allowed disabled:opacity-80 hover:rounded-lg duration-100"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Sure'}
          </button>
        </div>
      </div>
    </div>
  ) : null;
}

export default Modal;
