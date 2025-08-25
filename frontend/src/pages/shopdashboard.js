import { useState, useEffect, useRef } from "react";
import { QrCode, MoreVertical } from "lucide-react";
import ProductsView from "../components/productview.js";
import OrdersView from "../components/orderview.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import QrScanner from "qr-scanner";
import logo from "../assets/whitelogo.png";

export default function ShopOwnerDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [ordersView, setOrdersView] = useState("available");
  const [shopOwnerName, setShopOwnerName] = useState("");
  const [shopId, setShopId] = useState("");
  const [pendingOrders, setPendingOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filteredOrderId, setFilteredOrderId] = useState(null);

  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const menuRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfoString = localStorage.getItem("user");
        if (!userInfoString) {
          setLoading(false);
          return;
        }
        const userInfo = JSON.parse(userInfoString);
        if (userInfo.name) setShopOwnerName(userInfo.name);
        if (!userInfo.shopId) {
          setLoading(false);
          return;
        }
        const shopId = userInfo.shopId;
        setShopId(shopId);

        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const [pendingRes, historyRes, productsRes] = await Promise.all([
          axios.get(
            `http://localhost:4000/api/order/getorder/${shopId}?status=pending`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            `http://localhost:4000/api/order/getorder/${shopId}?status=accepted&status=declined`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            `http://localhost:4000/api/shop/shopproduct/${shopId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        setPendingOrders(pendingRes.data.orders || []);
        setHistoryOrders(historyRes.data.orders || []);
        setProducts(productsRes.data || []);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [navigate]);

  // QR Scanner functions
  const startScanner = () => {
    if (!videoRef.current) return;
    qrScannerRef.current = new QrScanner(
      videoRef.current,
      (result) => handleScan(result),
      { preferredCamera: "environment", highlightScanRegion: true, highlightCodeOutline: true }
    );
    qrScannerRef.current.start();
  };

  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current = null;
    }
  };
  
  
  const handleScan = async (result) => {
    if (!result) return;
    
    const rawData = result.data.trim();
  const orderId = rawData.includes("Order ID:")
    ? rawData.split("Order ID:")[1].trim()
    : rawData;

  console.log("Order ID:", orderId);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:4000/api/order/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && response.data._id) {
        stopScanner();
        setIsScannerOpen(false);

       
        setActiveTab("orders");
        setOrdersView("history");
        setFilteredOrderId(response.data._id);
        toast.success("Order found!");
      } else {
        toast.error("Order not found");
      }
    } catch (error) {
      toast.error("Failed to load order details");
    }
  };

  const clearFilter = () => setFilteredOrderId(null);

  const handleToggleView = (newView) => {
    setOrdersView(newView);
    setFilteredOrderId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    toast.success("Logged out successfully");
  };

  const handleViewProfile = () => {
    navigate("/profile");
    setIsMenuOpen(false);
  };

  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      }
    };
  }, []);

  const handleAcceptOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4000/api/order/accept/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const acceptedOrder = pendingOrders.find((o) => o._id === orderId);
      setPendingOrders(pendingOrders.filter((o) => o._id !== orderId));
      setHistoryOrders([...historyOrders, { ...acceptedOrder, status: "accepted" }]);
      toast.success("Order accepted successfully!");
    } catch {
      toast.error("Failed to accept order");
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4000/api/order/reject/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const rejectedOrder = pendingOrders.find((o) => o._id === orderId);
      setPendingOrders(pendingOrders.filter((o) => o._id !== orderId));
      setHistoryOrders([...historyOrders, { ...rejectedOrder, status: "declined" }]);
      toast.success("Order rejected successfully!");
    } catch {
      toast.error("Failed to reject order");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* QR Scanner Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4 text-center">
              Scan QR Code
            </h2>
            <div className="aspect-square w-full bg-black rounded-xl overflow-hidden relative">
              <video ref={videoRef} className="w-full h-full object-cover" playsInline />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-4 border-white border-dashed rounded-xl w-64 h-64" />
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => {
                  stopScanner();
                  setIsScannerOpen(false);
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (qrScannerRef.current) {
                    qrScannerRef.current.start();
                  } else {
                    startScanner();
                  }
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium"
              >
                Start Scanner
              </button>
            </div>
            <p className="text-gray-400 text-center mt-4 text-sm">
              Point your camera at a customer's QR code to scan their order
            </p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="bg-blue-600 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* <h1 className="text-2xl font-bold text-white">OrderBiz</h1> */}
          <img src={logo} alt="OrderBiz Logo" className="w-[8rem]" />
          <div className="flex items-center gap-2 relative">
            <button
              className="p-2 rounded-full hover:bg-blue-700"
              onClick={() => setIsScannerOpen(true)}
            >
              <QrCode size={20} className="text-white" />
            </button>
            <div className="relative" ref={menuRef}>
              <button
                className="p-2 rounded-full hover:bg-blue-700"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <MoreVertical size={20} className="text-white" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <button
                    onClick={handleViewProfile}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="mb-6">
          <p className="text-xl text-gray-700">
            Welcome, <span className="font-extrabold">{shopOwnerName}</span>
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col h-[75vh]">
          {/* Tabs */}
          <div className="flex-shrink-0 flex justify-center mb-8">
            <div className="bg-blue-600 p-1 rounded-full flex items-center shadow-inner">
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-4 sm:px-6 md:px-12 py-2 rounded-full font-bold text-sm md:text-base transition-all ${
                  activeTab === "orders"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-white"
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`px-4 sm:px-6 md:px-12 py-2 rounded-full font-bold text-sm md:text-base transition-all ${
                  activeTab === "products"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-white"
                }`}
              >
                Products
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="relative flex-grow overflow-y-auto no-scrollbar">
            {loading ? (
              <p className="text-center py-8">Loading dashboard...</p>
            ) : activeTab === "orders" ? (
              <OrdersView
                pendingOrders={pendingOrders}
                historyOrders={
                  filteredOrderId
                    ? historyOrders.filter((o) => o._id === filteredOrderId)
                    : historyOrders
                }
                handleAccept={handleAcceptOrder}
                handleReject={handleRejectOrder}
                view={ordersView}
                setView={handleToggleView}
                filteredOrderId={filteredOrderId}
                clearFilter={clearFilter}
              />
            ) : (
              <ProductsView
                products={products}
                setProducts={setProducts}
                shopId={shopId}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
