import React from "react";
import IconTextButton from "../Chat/IconTextButton";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * @desc Modal component with blurred background
 * @param {string} title - Title of the modal
 * @param {React.ReactNode} children - Components/elements inside the modal
 * @param {() => void} onClose - Function to close the modal
 * @returns {JSX.Element} Modal
 */

const Modal = ({ title, children, onClose, ref }) => (
  <div className="fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center">
    <div
      className="bg-white dark:bg-customDarkFg p-6 rounded-lg w-full max-w-md shadow-lg relative"
      ref={ref}
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <IconTextButton
        buttonProps={{ onClick: onClose }}
        className="absolute top-5 right-3 size-8 p-0 rounded-full border-1"
        icon={<FontAwesomeIcon icon={faXmark} className="size-4" />}
      />
      {children}
    </div>
  </div>
);
export default Modal;
