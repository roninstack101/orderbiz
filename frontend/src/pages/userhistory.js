import { useEffect, useState } from "react";
import { ChevronDown, QrCode, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Using default axios

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Manually get token and create config object
                const token = localStorage.getItem("token");
                console.log(token);
                if (!token) {
                    setLoading(false);
                    return;
                }
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                // Use axios with the full URL and config
                const res = await axios.get('http://localhost:4000/api/order/myorders', config);
                setOrders(res.data);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const toggleExpand = (orderId) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'accepted':
                return {
                    bgColor: 'bg-green-50',
                    textColor: 'text-green-800',
                    borderColor: 'border-green-200',
                    badgeColor: 'bg-green-100 text-green-800'
                };
            case 'declined':
                return {
                    bgColor: 'bg-red-50',
                    textColor: 'text-red-800',
                    borderColor: 'border-red-200',
                    badgeColor: 'bg-red-100 text-red-800'
                };
            default: // pending
                return {
                    bgColor: 'bg-gray-50',
                    textColor: 'text-gray-800',
                    borderColor: 'border-gray-200',
                    badgeColor: 'bg-gray-100 text-gray-800'
                };
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm sticky top-0 z-10 p-4 flex items-center">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold mx-auto">My Orders</h1>
            </header>

            <main className="max-w-4xl mx-auto py-8 px-4">
                {loading ? (
                    <p className="text-center text-gray-500">Loading your orders...</p>
                ) : orders.length === 0 ? (
                    <p className="text-center text-gray-500">You haven't placed any orders yet.</p>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => {
                            const styles = getStatusStyles(order.status);
                            const isExpanded = expandedOrderId === order._id;

                            return (
                                <div key={order._id} className={`rounded-lg border ${styles.borderColor} ${styles.bgColor} transition-all duration-300`}>
                                    {/* Collapsed View */}
                                    <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(order._id)}>
                                        <div className="flex items-center gap-4">
                                            {order.status === 'accepted' && order.qrCode && <QrCode className="w-10 h-10 text-gray-600" />}
                                            <div>
                                                <p className="font-bold text-lg">{order.shop.name}</p>
                                                <p className="text-xs text-gray-500">ID: {order._id}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles.badgeColor}`}>{order.status}</span>
                                            <p className="font-semibold text-lg">₹{order.totalPrice.toFixed(2)}</p>
                                            <ChevronDown className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                        </div>
                                    </div>

                                    {/* Expanded View */}
                                    {isExpanded && (
                                        <div className={`p-4 border-t ${styles.borderColor}`}>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {order.status === 'accepted' && order.qrCode && (
                                                    <div className="md:col-span-1 flex flex-col items-center">
                                                        <h4 className="font-semibold mb-2">Show this QR at the shop</h4>
                                                        <img src={order.qrCode} alt="Order QR Code" className="w-48 h-48 rounded-lg" />
                                                    </div>
                                                )}
                                                <div className="md:col-span-2">
                                                    <h4 className="font-semibold mb-2">Order Summary</h4>
                                                    <ul className="space-y-2">
                                                        {order.items.map(item => (
                                                            <li key={item.product?._id || item._id} className="flex justify-between text-sm">
                                                                <span>{item.product?.name || 'Product not available'} x {item.quantity}</span>
                                                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <div className="border-t my-2"></div>
                                                    <div className="flex justify-between font-bold">
                                                        <span>Total</span>
                                                        <span>₹{order.totalPrice.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}