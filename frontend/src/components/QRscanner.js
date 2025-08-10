import { useState } from "react";
import { QrReader } from "react-qr-reader";
import axios from "axios";

export default function QRScanner() {
  const [scannedData, setScannedData] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async (result) => {
    // Only process a new scan if we're not already loading and the data is new
    if (!loading && result?.text && result.text !== scannedData) {
      setLoading(true);
      setError('');
      setScannedData(result.text);
      
      try {
        // ✅ Add authentication header to the request
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Assuming your backend route is /api/orders/single/:orderId
        const response = await axios.get(`/api/orders/single/${result.text}`, config);
        
        setOrderDetails(response.data.order);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Invalid or expired QR code. Please try again.");
        setOrderDetails(null); // Clear previous details on error
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Scan Order QR Code</h2>
      <div className="w-full max-w-xs mx-auto border-4 border-gray-300 rounded-lg overflow-hidden">
        <QrReader
          onResult={handleScan}
          constraints={{ facingMode: "environment" }}
          containerStyle={{ width: "100%" }}
        />
      </div>
      
      {/* ✅ Improved User Feedback */}
      <div className="mt-4 text-center">
        {loading && <p className="text-blue-500">Verifying QR code...</p>}
        {error && <p className="text-red-500 font-semibold">{error}</p>}
      </div>

      {orderDetails && (
        <div className="mt-4 p-4 border rounded-lg bg-white shadow">
          <h3 className="text-lg font-bold">Order ID: {orderDetails._id}</h3>
          <p><strong>User:</strong> {orderDetails.user?.name}</p>
          <p><strong>Status:</strong> <span className="font-medium">{orderDetails.status}</span></p>
          <ul className="mt-2 list-disc pl-5">
            {orderDetails.items.map((item, idx) => (
              <li key={idx}>
                {item.product?.name} — Qty: {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}