

const ConfirmDeleteModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-sans">
    <div className="bg-white p-6 rounded-lg shadow-xl text-center w-full max-w-sm">
      <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
      <p className="text-sm text-gray-600 mb-6">Do you really want to delete this product? This action cannot be undone.</p>
      <div className="flex justify-center gap-4">
        <button onClick={onCancel} className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold">Cancel</button>
        <button onClick={onConfirm} className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-semibold">Delete</button>
      </div>
    </div>
  </div>
);

export default ConfirmDeleteModal;