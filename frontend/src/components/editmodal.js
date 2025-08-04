import { useState, useRef } from "react";



const EditProductModal = ({ product, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    quantity: product?.quantity || '0',
  });
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd use FormData for file uploads
    onUpdate(product._id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-blue-100 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <div onClick={() => fileInputRef.current.click()} className="w-24 h-24 bg-white rounded-full mx-auto border-2 border-gray-300 flex items-center justify-center cursor-pointer">
            {imageFile ? (
              <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover rounded-full" />
            ) : product?.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-xs text-gray-500">Product Image</span>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold text-gray-700">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 mt-1 border rounded-lg" required />
          </div>
          <div>
            <label className="font-semibold text-gray-700">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 mt-1 border rounded-lg" rows="3"></textarea>
          </div>
          <div>
            <label className="font-semibold text-gray-700">Price</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 mt-1 border rounded-lg" required />
          </div>
          <div>
            <label className="font-semibold text-gray-700">Quantity</label>
            <input type="text" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full p-2 mt-1 border rounded-lg" required />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-lg bg-gray-300 text-gray-800 font-bold hover:bg-gray-400">Cancel</button>
            <button type="submit" className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700">CONFIRM</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;