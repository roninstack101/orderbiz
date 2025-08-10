import { useEffect, useState } from "react";
import { Minus, Plus, Trash2, UserCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
    const [groupedShops, setGroupedShops] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const userId = user?.userId;
    const token = localStorage.getItem("token");
    
    const fetchCart = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
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

    const handleQuantityChange = async (productId, isAdding) => {
        const url = isAdding 
            ? "http://localhost:4000/api/cart/addcart" 
            : "http://localhost:4000/api/cart/remove";

        try {
            const data = { userid: userId, productid: productId, quantity: 1 };
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(url, data, config);
            fetchCart();
        } catch (err) {
            console.error("Failed to update quantity", err);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await axios.delete(`http://localhost:4000/api/cart/deletefromcart`, { 
                headers: { Authorization: `Bearer ${token}` },
                data: { userid: userId, productid: productId } 
            });
            fetchCart();
        } catch (err) {
            console.error("Failed to remove item", err);
        }
    };
    
    const handleCheckout = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.post(
                "http://localhost:4000/api/order/checkout", 
                { userid: userId }, 
                config
            );
            alert(res.data.message);
            navigate('/orders');
        } catch(err) {
            alert(err.response?.data?.message || "Checkout failed");
        }
    }

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Responsive Header */}
            <div className="flex justify-between items-center bg-[#0067D8] py-3 px-4 md:py-4 md:px-6 z-20">
                <h1 className="text-white font-bold text-xl sm:text-2xl md:text-3xl">OrderBiz</h1>
                <div className="relative group">
                    <UserCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white cursor-pointer" />
                    <div className="absolute right-0 mt-2 w-32 sm:w-40 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-30">
                        <a
                            href="/profile"
                            className="block px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-gray-100"
                        >
                            Profile
                        </a>
                        <button
                            onClick={() => {
                                localStorage.clear();
                                navigate("/");
                            }}
                            className="block w-full text-left px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">Your Cart</h2>
                
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-500">Loading cart...</div>
                    </div>
                ) : (!groupedShops || groupedShops.length === 0) ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="text-gray-500 mb-4">Your cart is empty</div>
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 sm:space-y-6">
                            {groupedShops.map((shopGroup) => (
                                <div key={shopGroup.shopId} className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow border border-gray-200">
                                    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-600">
                                        {shopGroup.shopName}
                                    </h3>
                                    <div className="space-y-3 sm:space-y-4">
                                        {shopGroup.items.map((item) => (
                                            <div key={item.product._id} className="flex flex-col xs:flex-row items-center justify-between py-3 border-b last:border-b-0">
                                                {/* Item details - Responsive layout */}
                                                <div className="flex items-center gap-3 mb-3 xs:mb-0 w-full xs:w-auto">
                                                    <div className="flex-shrink-0">
                                                        <img 
                                                            src={item.product.image || 'https://via.placeholder.com/150'} 
                                                            alt={item.product.name} 
                                                            className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md"
                                                        />
                                                    </div>
                                                    <div className="flex-grow min-w-0">
                                                        <h4 className="font-semibold text-sm sm:text-base truncate">
                                                            {item.product.name}
                                                        </h4>
                                                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                                                            <p className="text-sm text-gray-600">₹{item.product.price}</p>
                                                            <p className="text-xs text-gray-500">
                                                                Subtotal: ₹{(item.product.price * item.quantity).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Quantity controls - Responsive adjustments */}
                                                <div className="flex items-center justify-between w-full xs:w-auto">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <button 
                                                            onClick={() => handleQuantityChange(item.product._id, false)} 
                                                            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                                                            disabled={item.quantity <= 1}
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </button>
                                                        <span className="w-6 sm:w-8 text-center text-sm sm:text-base">
                                                            {item.quantity}
                                                        </span>
                                                        <button 
                                                            onClick={() => handleQuantityChange(item.product._id, true)} 
                                                            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100"
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </button>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleRemoveItem(item.product._id)} 
                                                        className="text-red-500 hover:text-red-700 ml-3 sm:ml-4 p-1.5"
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-right font-semibold mt-3 sm:mt-4 text-sm sm:text-base">
                                        Shop Subtotal: ₹{shopGroup.subtotal.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Grand Total and Checkout - Responsive layout */}
                        <div className="mt-6 sm:mt-8 p-4 sm:p-5 md:p-6 bg-white rounded-lg shadow border border-gray-200 flex flex-col sm:flex-row items-center justify-between">
                            <div className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
                                Grand Total: <span className="text-blue-600">₹{grandTotal.toFixed(2)}</span>
                            </div>
                            <button 
                                onClick={handleCheckout} 
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition text-sm sm:text-base"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}