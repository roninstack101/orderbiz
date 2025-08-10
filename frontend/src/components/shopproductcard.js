import { ToggleLeft, X, ToggleRight, Edit } from "lucide-react";

const ShopProductCard = ({ product, onDelete, onEdit, onToggleAvailability }) => {
  const isAvailable = product.isAvailable;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 relative font-sans mb-4">
      <button 
        onClick={onDelete} 
        className="absolute top-3 right-3 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
        aria-label="Delete Product"
      >
        <X size={16} />
      </button>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-full flex-shrink-0 mx-auto sm:mx-0">
          <img 
            src={product.image || 'https://m.media-amazon.com/images/I/61ICUTTYR-L._UF350,350_QL80_.jpg'} 
            alt={product.name} 
            className="w-full h-full object-cover rounded-full" 
          />
        </div>
        
        <div className="flex-grow text-center sm:text-left">
          <h3 className="font-bold text-lg text-gray-800 truncate">{product.name}</h3>
          <p className="text-sm text-gray-600 leading-snug mt-1 line-clamp-2">
            {product.description || "No description available"}
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 mt-2">
            <p className="text-sm font-semibold text-gray-700">₹{product.price}</p>
            <p className="text-sm font-semibold text-gray-700">{product.quantity}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <button
          onClick={onToggleAvailability}
          className={`flex-1 py-2 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
            isAvailable 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          {isAvailable ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
          {isAvailable ? 'Available' : 'Unavailable'}
        </button>
        <button 
          onClick={onEdit} 
          className="flex-1 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm hover:bg-blue-200 transition-colors flex items-center justify-center gap-1"
        >
          <Edit size={16} /> Edit
        </button>
      </div>
    </div>
  );
};

export default ShopProductCard;