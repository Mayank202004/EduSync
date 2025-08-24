import React from 'react'

/**
 * @desc Modal component with blurred background
 * @param {string} title - Title of the modal
 * @param {React.ReactNode} children - Components/elements inside the modal
 * @param {() => void} onClose - Function to close the modal
 * @returns {JSX.Element} Modal
 */

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center">
    <div className="bg-white dark:bg-customDarkFg p-6 rounded-lg w-full max-w-md shadow-lg relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-600 dark:text-gray-400 hover:text-black"
      >
        ×
      </button>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  </div>
);
export default Modal;
