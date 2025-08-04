import React, { useState, useEffect, useRef } from 'react';
import { LayoutGrid, MoreVertical, History, Plus, X, Edit, ToggleLeft, ToggleRight, User, Check, ChevronDown, CheckCircle2, XCircle, ListOrdered, ScanLine } from 'lucide-react';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';

// ============================================================================
// 1. Reusable Modal Components
// ============================================================================

const ConfirmDeleteModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-lg shadow-xl text-center w-full max-w-sm">
      <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
      <p className="text-sm text-gray-600 mb-6">Do you really want to delete this product? This action cannot be undone.</p>
      <div className="flex justify-center gap-4">
        <button onClick={onCancel} className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold">Cancel</button>
        <button onClick={onConfirm} className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-semibold">Delete</button>
      </div>
    </div>
  </div>
);

const EditProductModal = ({ product, onUpdate, onCancel, isAddingNew = false }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    quantity: product?.quantity || 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = new FormData();
    Object.keys(formData).forEach(key => {
      updatedData.append(key, formData[key]);
    });
    if (imageFile) {
      updatedData.append('image', imageFile);
    }
    onUpdate(product?._id, updatedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-blue-100 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">{isAddingNew ? 'Add New Product' : 'Edit Product'}</h2>
        <div className="text-center mb-6">
          <div onClick={() => fileInputRef.current.click()} className="w-24 h-24 bg-white rounded-full mx-auto border-2 border-gray-300 flex items-center justify-center cursor-pointer mb-4">
            {imageFile ? <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover rounded-full" /> : product?.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-full" /> : <span className="text-xs text-gray-500">Product Image</span>}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="font-semibold text-gray-700">Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 mt-1 border rounded-lg" required /></div>
          <div><label className="font-semibold text-gray-700">Description</label><textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 mt-1 border rounded-lg" rows="3"></textarea></div>
          <div><label className="font-semibold text-gray-700">Price</label><input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 mt-1 border rounded-lg" required /></div>
          <div><label className="font-semibold text-gray-700">Quantity</label><input type="text" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full p-2 mt-1 border rounded-lg" required /></div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-lg bg-gray-300 text-gray-800 font-bold hover:bg-gray-400">Cancel</button>
            <button type="submit" className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700">{isAddingNew ? 'ADD' : 'CONFIRM'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ScannedOrderModal = ({ order, onClose }) => {
    if (!order) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h3 className="text-lg font-bold mb-4">Scanned Order Details</h3>
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Customer:</strong> {order.user.name}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total:</strong> ₹{order.totalPrice.toFixed(2)}</p>
                <button onClick={onClose} className="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg">Close</button>
            </div>
        </div>
    );
};

// ============================================================================
// 2. Reusable Card Components
// ============================================================================

const ShopProductCard = ({ product, onDelete, onEdit, onToggleAvailability }) => {
  const isAvailable = product.isAvailable;
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 relative">
      <button onClick={onDelete} className="absolute top-3 right-3 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 z-10"><X size={16} /></button>
      <div className="flex gap-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex-shrink-0"><img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-cover rounded-full" /></div>
        <div className="flex-grow">
          <h3 className="font-bold text-lg">{product.name}</h3>
          <p className="text-sm text-gray-600 leading-snug mt-1">{product.description}</p>
          <p className="text-sm font-semibold mt-2">Price: ₹{product.price}</p>
          <p className="text-sm font-semibold">Quantity: {product.quantity}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={onToggleAvailability} className={`flex-1 py-2 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${isAvailable ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>{isAvailable ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}{isAvailable ? 'Available' : 'Unavailable'}</button>
        <button onClick={onEdit} className="flex-1 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm hover:bg-blue-200 transition-colors">Edit</button>
      </div>
    </div>
  );
};

const OrderCard = ({ order, onAccept, onReject }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleButtonClick = (e, action) => { e.stopPropagation(); action(); };
  return (
    <div className="bg-white rounded-xl shadow-md transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg" onClick={() => setIsExpanded(!isExpanded)}>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4"><div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200"><User size={32} className="text-gray-400" /></div><div><p className="font-bold text-gray-800">{order.user.name}</p><p className="text-sm text-gray-500">{order.user.email}</p><p className="text-sm text-gray-500">{order.user.phone}</p></div></div>
        <div className="flex items-center gap-2"><button onClick={(e) => handleButtonClick(e, () => onReject(order._id))} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition" aria-label="Reject Order"><X size={20} /></button><button onClick={(e) => handleButtonClick(e, () => onAccept(order._id))} className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition" aria-label="Accept Order"><Check size={20} /></button><ChevronDown className={`text-gray-400 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} /></div>
      </div>
      {isExpanded && (<div className="border-t border-gray-200 p-4"><h4 className="font-semibold mb-2 text-gray-600">Order Details:</h4><div className="space-y-2">{order.items.map((item) => (<div key={item.product._id} className="grid grid-cols-3 items-center text-sm"><span className="text-gray-700 col-span-1 truncate">{item.product.name}</span><span className="text-gray-500 col-span-1 text-center">₹{item.price} x {item.quantity}</span><span className="text-gray-800 font-medium col-span-1 text-right">₹{(item.price * item.quantity).toFixed(2)}</span></div>))}</div><div className="border-t border-gray-200 my-3"></div><div className="flex justify-between font-bold text-lg text-gray-800"><span>TOTAL</span><span>₹{order.totalPrice.toFixed(2)}</span></div></div>)}
    </div>
  );
};

const OrderHistoryCard = ({ order }) => {
  const isAccepted = order.status === 'accepted';
  const statusStyles = isAccepted ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      <div className="p-6"><div className="mb-4"><p className="font-semibold text-gray-800">Name: {order.user.name}</p><p className="text-sm text-gray-600">Phone: {order.user.phone}</p><p className="text-sm text-gray-600">Email: {order.user.email}</p><p className="text-xs text-gray-400 mt-1">Order ID: {order._id}</p></div><div><h4 className="text-xl font-bold text-gray-800 mb-2">Order</h4><div className="space-y-2">{order.items.map((item) => (<div key={item.product._id} className="grid grid-cols-3 items-center text-sm"><span className="text-gray-700 col-span-1 truncate">{item.product.name}</span><span className="text-gray-500 col-span-1 text-center">₹{item.price} x {item.quantity}</span><span className="text-gray-800 font-medium col-span-1 text-right">₹{(item.price * item.quantity).toFixed(2)}</span></div>))}</div><div className="border-t border-gray-200 my-3"></div><div className="flex justify-between font-bold text-lg text-gray-800"><span>TOTAL</span><span>₹{order.totalPrice.toFixed(2)}</span></div></div></div>
      <div className={`p-4 flex items-center justify-center gap-2 font-semibold text-lg ${statusStyles}`}>{isAccepted ? <CheckCircle2 /> : <XCircle />}<span>{isAccepted ? 'ACCEPTED' : 'REJECTED'}</span></div>
    </div>
  );
};

// ============================================================================
// 3. View Components
// ============================================================================

const OrdersView = ({ pendingOrders, historyOrders, handleAccept, handleReject }) => {
  const [view, setView] = useState('available');
  return (
    <div className="relative pb-20">
      {view === 'available' ? (pendingOrders.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{pendingOrders.map(order => <OrderCard key={order._id} order={order} onAccept={handleAccept} onReject={handleReject} />)}</div>) : <p className="text-center text-gray-500 mt-8 py-8">No available orders.</p>) : (historyOrders.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{historyOrders.map(order => <OrderHistoryCard key={order._id} order={order} />)}</div>) : <p className="text-center text-gray-500 mt-8 py-8">No order history.</p>)}
      <button onClick={() => setView(prev => prev === 'available' ? 'history' : 'available')} className="fixed bottom-12 right-12 bg-white text-blue-600 font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-gray-50 flex items-center gap-2 z-20 border border-gray-200">
        {view === 'available' ? <History size={20} /> : <ListOrdered size={20} />}
        {view === 'available' ? 'History' : 'Available Orders'}
      </button>
    </div>
  );
};

const ProductsView = ({ products, setProducts, shopId }) => {
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:4000/api/products/${productToDelete._id}`, config);
      setProducts(prev => prev.filter(p => p._id !== productToDelete._id));
      setProductToDelete(null);
    } catch (err) { alert("Failed to delete product."); }
  };

  const handleUpdate = async (productId, updatedData) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
      const res = await axios.patch(`http://localhost:4000/api/products/${productId}`, updatedData, config);
      setProducts(prev => prev.map(p => (p._id === productId ? res.data.product : p)));
      setProductToEdit(null);
    } catch (err) { alert("Failed to update product."); }
  };

  const handleToggleAvailability = async (product) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.patch(`http://localhost:4000/api/products/${product._id}`, { isAvailable: !product.isAvailable }, config);
      setProducts(prev => prev.map(p => (p._id === product._id ? res.data.product : p)));
    } catch (err) { alert("Failed to update availability."); }
  };

  const handleAdd = async (_, newData) => {
    try {
      newData.append('shop', shopId);
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
      const res = await axios.post('http://localhost:4000/api/products', newData, config);
      setProducts(prev => [...prev, res.data.product]);
      setIsAdding(false);
    } catch (err) { alert("Failed to add product."); }
  };

  return (
    <div className="relative pb-20">
      {products.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{products.map(product => (<ShopProductCard key={product._id} product={product} onDelete={() => setProductToDelete(product)} onEdit={() => setProductToEdit(product)} onToggleAvailability={() => handleToggleAvailability(product)} />))}</div>) : <p className="text-center text-gray-500 mt-8 py-8">You haven't added any products yet.</p>}
      <button onClick={() => setIsAdding(true)} className="fixed bottom-12 right-12 bg-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 flex items-center gap-2 z-20"><Plus size={20} /> Add</button>
      {productToDelete && <ConfirmDeleteModal onConfirm={handleDelete} onCancel={() => setProductToDelete(null)} />}
      {(productToEdit || isAdding) && <EditProductModal product={productToEdit} onUpdate={isAdding ? handleAdd : handleUpdate} onCancel={() => { setProductToEdit(null); setIsAdding(false); }} isAddingNew={isAdding} />}
    </div>
  );
};

const QRScannerView = ({ onScanSuccess, onClose }) => (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
        <QrReader
            onResult={(result, error) => {
              if (!!result) { onScanSuccess(result); }
              if (!!error) { console.info(error); }
            }}
            constraints={{ facingMode: "environment" }}
            containerStyle={{ width: '80%', maxWidth: '400px' }}
        />
        <p className="text-white mt-4">Scan the customer's order QR code</p>
        <button onClick={onClose} className="mt-8 bg-white text-black font-semibold py-2 px-6 rounded-lg">Cancel</button>
    </div>
);

// ============================================================================
// 4. The Main Shop Owner Dashboard Component
// ============================================================================
export default function ShopOwnerDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [shopOwnerName, setShopOwnerName] = useState('');
  const [shopId, setShopId] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedOrder, setScannedOrder] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const userInfoString = localStorage.getItem('user');
    if (userInfoString) {
        try {
            const userInfo = JSON.parse(userInfoString);
            if (userInfo?.name) setShopOwnerName(userInfo.name);
            if (userInfo?.shop) setShopId(userInfo.shop._id || userInfo.shop);
        } catch (e) { console.error("Failed to parse user info", e); }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!shopId || !token) { if (!token) setLoading(false); return; }
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [pendingRes, acceptedRes, rejectedRes, productsRes] = await Promise.all([
          axios.get(`http://localhost:4000/api/orders/getorder/${shopId}?status=pending`, config),
          axios.get(`http://localhost:4000/api/orders/getorder/${shopId}?status=accepted`, config),
          axios.get(`http://localhost:4000/api/orders/getorder/${shopId}?status=declined`, config),
          axios.get(`http://localhost:4000/api/products/shopproduct/${shopId}`, config)
        ]);
        setPendingOrders(pendingRes.data.orders);
        const history = [...acceptedRes.data.orders, ...rejectedRes.data.orders];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setHistoryOrders(history);
        setProducts(productsRes.data);
      } catch (err) { console.error("Failed to load dashboard data", err); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, [shopId, token]);

  const handleAcceptOrder = async (orderId) => {
      try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const res = await axios.put(`http://localhost:4000/api/orders/accept/${orderId}`, {}, config);
          setPendingOrders(prev => prev.filter(order => order._id !== orderId));
          setHistoryOrders(prev => [res.data.order, ...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) { alert("Failed to accept order."); }
  };

  const handleRejectOrder = async (orderId) => {
      try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const res = await axios.put(`http://localhost:4000/api/orders/reject/${orderId}`, {}, config);
          setPendingOrders(prev => prev.filter(order => order._id !== orderId));
          setHistoryOrders(prev => [res.data.order, ...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) { alert("Failed to reject order."); }
  };

  const handleScanSuccess = async (result) => {
    if (result && result.text) {
        setIsScanning(false);
        try {
            const orderId = result.text.replace("Order ID: ", "");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // You need a new backend route for this: GET /api/orders/single/:orderId
            const res = await axios.get(`http://localhost:4000/api/orders/single/${orderId}`, config);
            setScannedOrder(res.data.order);
        } catch (err) { alert("Could not find order from QR code."); }
    }
  };
  
  return (
    <div className="min-h-screen bg-blue-50">
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      <header className="bg-blue-600 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between"><h1 className="text-2xl font-bold text-white">OrderBiz</h1><div className="flex items-center gap-2"><button onClick={() => setIsScanning(true)} className="p-2 rounded-full hover:bg-blue-700"><ScanLine className="text-white" /></button><button className="p-2 rounded-full hover:bg-blue-700"><MoreVertical size={20} className="text-white" /></button></div></div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="mb-6"><p className="text-xl text-gray-700">Welcome, <span className="font-extrabold">{shopOwnerName}</span></p></div>
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col h-[75vh]">
          <div className="flex-shrink-0 flex justify-center mb-8">
            <div className="bg-blue-600 p-1 rounded-full flex items-center shadow-inner">
              <button onClick={() => setActiveTab('orders')} className={`px-12 py-2 rounded-full font-bold text-base transition-all duration-300 ${activeTab === 'orders' ? 'bg-white text-blue-600 shadow-md' : 'text-white'}`}>Orders</button>
              <button onClick={() => setActiveTab('products')} className={`px-12 py-2 rounded-full font-bold text-base transition-all duration-300 ${activeTab === 'products' ? 'bg-white text-blue-600 shadow-md' : 'text-white'}`}>Products</button>
            </div>
          </div>
          <div className="relative flex-grow overflow-y-auto no-scrollbar">
            {loading ? <p className="text-center py-8">Loading dashboard...</p> : (
                <div>
                    {activeTab === 'orders' ? (<OrdersView pendingOrders={pendingOrders} historyOrders={historyOrders} handleAccept={handleAcceptOrder} handleReject={handleRejectOrder} />) : (<ProductsView products={products} setProducts={setProducts} shopId={shopId} />)}
                </div>
            )}
          </div>
        </div>
      </main>
      {isScanning && <QRScannerView onScanSuccess={handleScanSuccess} onClose={() => setIsScanning(false)} />}
      {scannedOrder && <ScannedOrderModal order={scannedOrder} onClose={() => setScannedOrder(null)} />}
    </div>
  );
}
