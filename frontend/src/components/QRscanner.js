import { useState } from "react";
import { QrReader } from "react-qr-reader";
import axios from "axios";

export default function QRScanner() {
  const [scannedData, setScannedData] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleScan = async (result) => {
    if (result?.text && result.text !== scannedData) {
      setScannedData(result.text); // order ID from QR
      try {
        const response = await axios.get(`/api/orders/${result.text}`);
        setOrderDetails(response.data.order); // assuming response has order object
      } catch (error) {
        console.error("Error fetching order:", error);
        alert("Invalid or expired QR code");
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Scan Order QR</h2>
      <div className="w-80 h-80">
        <QrReader
          onResult={handleScan}
          constraints={{ facingMode: "environment" }}
          containerStyle={{ width: "100%" }}
        />
      </div>

      {orderDetails && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="text-lg font-bold">Order ID: {orderDetails._id}</h3>
          <p>User: {orderDetails.user?.name}</p>
          <ul className="mt-2 list-disc pl-4">
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
