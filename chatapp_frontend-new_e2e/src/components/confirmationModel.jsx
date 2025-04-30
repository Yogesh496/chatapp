import { X } from "lucide-react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-base-300  bg-opacity-50 z-50">
      <div className=" rounded-lg p-6 shadow-lg w-80  bg-base-200 text-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm  mt-2">{message}</p>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-base-200  rounded-md hover:bg-base-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Confirm
          </button>
        </div>

        <button onClick={onClose} className="absolute top-3 right-3 ">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
