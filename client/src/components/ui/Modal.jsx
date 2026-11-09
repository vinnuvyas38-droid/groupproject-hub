// components/ui/Modal.jsx
// A reusable modal dialog with a dark backdrop.
// Click the backdrop or the X button to close.

export default function Modal({ isOpen, onClose, title, children }) {
  // Don't render anything if the modal is not open
  if (!isOpen) return null;

  return (
    // Backdrop — covers the whole screen with a semi-transparent black overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose} // clicking the backdrop closes the modal
    >
      {/* Modal box — stop click from bubbling so clicking inside doesn't close it */}
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with title and close button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Body — whatever form or content goes here */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}

