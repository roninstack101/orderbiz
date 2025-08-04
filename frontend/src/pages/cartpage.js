import { useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react"; // Added Trash2 icon
import axios from "axios";
import { UserCircle, Funnel} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
    // 1. ✅ Updated state to match the new API response
    const [groupedShops, setGroupedShops] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const userId = localStorage.getItem("userid");
    
     const token = localStorage.getItem("token");
    
    // 2. ✅ Updated fetchCart to set the new state variables
    const fetchCart = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }
        try {
            const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
          };

            const res = await axios.get(`http://localhost:4000/api/cart/getcart/${userId}`, config);
            setGroupedShops(res.data.groupedByShop || []);
            setGrandTotal(res.data.grandTotal || 0);
        } catch (err) {
            console.error("Failed to fetch cart", err);
        } finally {
            setLoading(false);
        }
    };

    // 3. ✅ Split update logic into separate functions
    const handleQuantityChange = async (productId, isAdding) => {
       const url = isAdding 
        ? "http://localhost:4000/api/cart/addcart" 
        : "http://localhost:4000/api/cart/remove";

    try {
        // 1. Define the data payload (the request body)
        const data = {
            userid: userId,
            productid: productId,
            quantity: 1
        };

        // 2. Define the config object with the headers
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // 3. Call axios.post with the correct 3 arguments: url, data, config
        await axios.post(url, data, config);
        
        fetchCart(); // Refetch the cart to get updated totals
    } catch (err) {
        console.error("Failed to update quantity", err);
    }
    };

    const handleRemoveItem = async (productId) => {
        try {
       
        await axios.delete(`http://localhost:4000/api/cart/deletefromcart`, { 
            headers: { 
                Authorization: `Bearer ${token}` 
            },
            data: { 
                userid: userId, 
                productid: productId 
            } 
        });

        fetchCart();
        
    } catch (err) {
        console.error("Failed to remove item", err);
    }

    };
    
    const handleCheckout = async () => {
        try {
           const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.post("http://localhost:4000/api/order/checkout", { userid: userId }, config  );
            alert(res.data.message);
            navigate('/orders'); // Navigate to an order history page
        } catch(err) {
            alert(err.response?.data?.message || "Checkout failed");
        }
    }

    useEffect(() => {
        fetchCart();
    }, []);

    // if (loading) return <div className="p-6 text-center">Loading cart...</div>;

    // if (!groupedShops || groupedShops.length === 0) {
    //     return <div className="p-6 text-center text-gray-600">Your cart is empty</div>;
    // }

    return (
        <div className="min-h-screen bg-gray-50  ">
          {/* Header */}
      <div className="flex justify-between items-center bg-[#0067D8] py-4 px-6 z-20">
        <h1 className="text-white font-bold text-3xl">OrderBiz</h1>
        <div className="relative group">
          <UserCircle className="w-6 h-6 text-white cursor-pointer" />
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <a
              href="/profile"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Profile
            </a>
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
           
           <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h2>
            
           {loading ? (
                    <div className="text-center text-gray-500 mt-20">Loading cart...</div>
                ) : (!groupedShops || groupedShops.length === 0) ? (
                    <div className="text-center text-gray-500 mt-20">Your cart is empty</div>
                ) : (
                    <>
                        {/* This is the main content that shows when the cart has items */}
                        <div className="space-y-6">
                            {groupedShops.map((shopGroup) => (
                                <div key={shopGroup.shopId} className="bg-slate-300 p-6 rounded-lg shadow">
                                    <h3 className="text-xl font-semibold mb-4 text-blue-600">{shopGroup.shopName}</h3>
                                    <div className="space-y-4">
                                        {shopGroup.items.map((item) => (
                                            <div key={item.product._id} className="flex flex-col sm:flex-row items-center justify-between py-2 border-b last:border-b-0">
                                                {/* Item details */}
                                                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                                    <img src={item.product.image || 'https://via.placeholder.com/150'} alt={item.product.name} className="w-16 h-16 object-cover rounded-md" />
                                                    <div>
                                                        <h4 className="font-semibold">{item.product.name}</h4>
                                                        <p className="text-sm text-gray-600">₹{item.product.price}</p>
                                                    </div>
                                                </div>
                                                {/* Quantity controls */}
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => handleQuantityChange(item.product._id, false)} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50" disabled={item.quantity <= 1}>
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-8 text-center">{item.quantity}</span>
                                                    <button onClick={() => handleQuantityChange(item.product._id, true)} className="p-2 rounded-full hover:bg-gray-200">
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleRemoveItem(item.product._id)} className="text-red-500 hover:text-red-700 ml-4">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-right font-semibold mt-4">
                                        Shop Subtotal: ₹{shopGroup.subtotal.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Grand Total and Checkout */}
                        <div className="mt-8 p-6 bg-white rounded-lg shadow flex flex-col sm:flex-row items-center justify-between">
                            <div className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
                                Grand Total: ₹{grandTotal.toFixed(2)}
                            </div>
                            <button onClick={handleCheckout} className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition">
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}            </div>
        </div>
    );
}

