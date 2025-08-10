import { useState, useRef, useEffect } from "react";

const EditProductModal = ({ product, onUpdate, onCancel, isAddingNew }) => {
    // console.log(product)
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', quantity: '', category: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef(null);

  // Initialize form data
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        quantity: product.quantity || '',
        category: product.category || '',
      });
      setPreview(product.image || "");
    } else {
      setFormData({ name: '', description: '', price: '', quantity: '', category: '' });
      setPreview("");
    }
    setImageFile(null);
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

 const handleSubmit = (e) => {
  e.preventDefault();
  if (!formData.name || !formData.price || !formData.quantity) {
    alert('Please fill in all required fields');
    return;
  }
  onUpdate({ ...formData, imageFile, _id: product?._id });
};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-blue-50 p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg sm:text-xl font-bold text-center mb-3 text-gray-800">
          {isAddingNew ? "Add Product" : "Edit Product"}
        </h2>
        
        {/* Image Upload */}
        <div className="text-center mb-4">
          <div 
            onClick={() => fileInputRef.current.click()} 
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden"
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-gray-500">Upload</span>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
          <p className="text-xs text-gray-500 mt-1">
            {preview ? "Click to change" : "No image"}
          </p>
        </div>
        
        {/* Compact Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="font-medium text-sm text-gray-700">Name *</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-lg bg-white text-sm" 
              required 
            />
          </div>
          
          <div className="space-y-1">
            <label className="font-medium text-sm text-gray-700">Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-lg bg-white text-sm" 
              rows="2"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-sm text-gray-700">Price *</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                className="w-full p-2 border rounded-lg bg-white text-sm" 
                min="0.01"
                step="0.01"
                required 
              />
            </div>
            
            <div className="space-y-1">
              <label className="font-medium text-sm text-gray-700">Quantity *</label>
              <input 
                type="text" 
                name="quantity" 
                value={formData.quantity} 
                onChange={handleChange} 
                className="w-full p-2 border rounded-lg bg-white text-sm" 
                placeholder="e.g., 1 pc, 500g"
                required 
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="font-medium text-sm text-gray-700">Category</label>
            <input 
              type="text" 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-lg bg-white text-sm"
              placeholder="e.g., Electronics, Groceries"
            />
          </div>
          
          <div className="flex gap-3 pt-3">
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 text-sm"
            >
              {isAddingNew ? "Add" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;