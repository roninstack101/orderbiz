import { Minus, Plus } from "lucide-react";

export default function ProductCard({ product, quantity, onAdd, onRemove }) {
  return (
    <div className="flex flex-col justify-between p-4 rounded-xl shadow-md bg-white h-full">
      {/* Image container with aspect ratio */}
      <div className="w-full aspect-[4/3] rounded-lg overflow-hidden">
        <img
          src={product.image || 'https://m.media-amazon.com/images/I/61ICUTTYR-L._UF350,350_QL80_.jpg'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mt-2 flex-1 flex flex-col justify-between">
        <div>
          {/* Truncate long product names */}
          <h3 className="font-bold text-sm sm:text-base md:text-lg truncate">
            {product.name}
          </h3>
          
          <div className="flex justify-between mt-1">
            <p className="text-sm sm:text-base font-semibold">₹{product.price}</p>
            <p className="text-xs sm:text-sm text-gray-600">
              Stock: {product.quantity}
            </p>
          </div>
        </div>

        {/* Quantity controls */}
        {quantity === 0 ? (
          <button
            onClick={onAdd}
            className="mt-3 sm:mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-full text-sm sm:text-base hover:bg-blue-700 transition w-full"
          >
            Add to cart
          </button>
        ) : (
          <div className="mt-3 sm:mt-4 bg-white border border-gray-300 rounded-full flex items-center justify-between px-3 py-2 w-full max-w-[140px] self-center">
            <button
              onClick={onRemove}
              className="text-blue-600 p-1"
              aria-label="Decrease quantity"
            >
              <Minus size={18} />
            </button>
            <span className="font-bold text-sm sm:text-base mx-2 min-w-[20px] text-center">
              {quantity}
            </span>
            <button
              onClick={onAdd}
              className="text-blue-600 p-1"
              aria-label="Increase quantity"
            >
              <Plus size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}