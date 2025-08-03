import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const [count, setCount] = useState(1);

  return (
    <div className="h-[250px] xl:h-[320px] flex flex-col justify-between p-4 rounded-xl shadow-md bg-white">
  <img
    src={product.image}
    alt={product.name}
    className="w-full h-[100px] md:h-[180px] object-cover rounded-lg"
  />
  <div className="mt-2 flex-1 flex flex-col justify-between">
    <div>
      <h3 className="text-sm sm:text-base font-bold">{product.name}</h3>
      <p className="text-sm font-semibold">₹{product.price}</p>
      <p className="text-sm font-semibold">Quantity: {product.quantity}</p>
    </div>

    {!added ? (
      <button
        onClick={() => setAdded(true)}
        className="mt-4 bg-blue-600 text-white font-semibold py-2 rounded-full text-sm sm:text-base"
      >
        Add to cart
      </button>
    ) : (
      <div className="mt-4 bg-white rounded-full flex items-center justify-between px-3 py-1 w-full max-w-[120px] self-center">
        <button
          onClick={() => {
            if (count > 1) {
              setCount((prev) => prev - 1);
            } else {
              setAdded(false);
              setCount(1);
            }
          }}
          className="text-blue-600"
        >
          <Minus size={18} />
        </button>
        <span className="font-bold text-sm">{count.toString().padStart(2, "0")}</span>
        <button
          onClick={() => {
            if (count < 5) {
              setCount((prev) => prev + 1);
            }
          }}
          className="text-blue-600"
        >
          <Plus size={18} />
        </button>
      </div>
    )}
  </div>
</div>
  )
}
