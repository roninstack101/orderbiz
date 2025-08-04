import { Minus, Plus } from "lucide-react";

// 1. ✅ Accept quantity, onAdd, and onRemove as props
export default function ProductCard({ product, quantity, onAdd, onRemove }) {
  return (
    <div className="h-[250px] xl:h-[320px] flex flex-col justify-between p-4 rounded-xl shadow-md bg-white">
      <img
        src={product.image || 'https://via.placeholder.com/150'}
        alt={product.name}
        className="w-full h-[100px] md:h-[180px] object-cover rounded-lg"
      />
      <div className="mt-2 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold">{product.name}</h3>
          <p className="text-sm font-semibold">₹{product.price}</p>
          <p className="text-sm font-semibold">In Stock: {product.quantity}</p>
        </div>

        {/* 2. ✅ Use the 'quantity' prop to decide what to show */}
        {quantity === 0 ? (
          <button
            // 3. ✅ Call the onAdd function from props
            onClick={onAdd}
            className="mt-4 bg-blue-600 text-white font-semibold py-2 rounded-full text-sm sm:text-base hover:bg-blue-700 transition"
          >
            Add to cart
          </button>
        ) : (
          <div className="mt-4 bg-white border border-gray-300 rounded-full flex items-center justify-between px-3 py-1 w-full max-w-[120px] self-center">
            <button
              // 4. ✅ Call the onRemove function from props
              onClick={onRemove}
              className="text-blue-600"
            >
              <Minus size={18} />
            </button>
            {/* 5. ✅ Display the 'quantity' from props */}
            <span className="font-bold text-sm">{quantity}</span>
            <button
              // 6. ✅ Call the onAdd function from props
              onClick={onAdd}
              className="text-blue-600"
            >
              <Plus size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}