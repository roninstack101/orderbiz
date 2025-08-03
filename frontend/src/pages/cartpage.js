import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import axios from "axios";

export default function CartPage({ userId }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`/api/cart/${userId}`);
      setCart(res.data);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, change) => {
    try {
      const quantity = change;
      await axios.post("/api/cart/add", { userid: userId, productid: productId, quantity });
      fetchCart();
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.post("/api/cart/remove", { userid: userId, productid: productId });
      fetchCart();
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <div className="p-6">Loading cart...</div>;

  if (!cart || cart.items.length === 0)
    return <div className="p-6 text-center text-gray-600">Your cart is empty</div>;

  return (
    <div className="min-h-screen bg-white p-6">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.product._id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div>
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-sm text-gray-600">₹{item.product.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="bg-gray-200 px-2 py-1 rounded-full"
                onClick={() => updateQuantity(item.product._id, -1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>

              <span>{item.quantity}</span>

              <button
                className="bg-gray-200 px-2 py-1 rounded-full"
                onClick={() => updateQuantity(item.product._id, 1)}
              >
                <Plus className="w-4 h-4" />
              </button>

              <button
                className="text-red-500 text-sm underline ml-4"
                onClick={() => removeItem(item.product._id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right text-xl font-semibold">
        Total: ₹{cart.totalprice}
      </div>
    </div>
  );
}
