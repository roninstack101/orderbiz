import { ToggleLeft, X, ToggleRight } from "lucide-react";

const ShopProductCard = ({ product, onDelete, onEdit, onToggleAvailability }) => {
  const isAvailable = product.isAvailable;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 relative font-sans">
      <button 
        onClick={onDelete} 
        className="absolute top-3 right-3 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
        aria-label="Delete Product"
      >
        <X size={16} />
      </button>
      <div className="flex gap-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex-shrink-0">
          <img 
            src={product.image || 'https://via.placeholder.com/150'} 
            alt={product.name} 
            className="w-full h-full object-cover rounded-full" 
          />
        </div>
        <div className="flex-grow">
          <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
          <p className="text-sm text-gray-600 leading-snug mt-1">{product.description}</p>
          <p className="text-sm font-semibold mt-2 text-gray-700">Price: ₹{product.price}</p>
          <p className="text-sm font-semibold text-gray-700">Quantity: {product.quantity}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={onToggleAvailability}
          className={`flex-1 py-2 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
            isAvailable 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          {isAvailable ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
          {isAvailable ? 'Available' : 'Unavailable'}
        </button>
        <button 
          onClick={onEdit} 
          className="flex-1 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm hover:bg-blue-200 transition-colors"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default ShopProductCard;