import { CheckCircle2, XCircle } from "lucide-react";

const OrderHistoryCard = ({ order }) => {
  const isAccepted = order.status === 'accepted';
  const statusStyles = isAccepted
    ? 'bg-green-500 text-white'
    : 'bg-red-500 text-white';

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 font-sans flex flex-col h-full">
      <div className="p-4 sm:p-6 flex-grow">
        <div className="mb-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-gray-800 truncate">
                {order.user?.name || "Customer"}
              </p>
              <p className="text-sm text-gray-600 truncate">
                {order.user?.phone || "No phone"}
              </p>
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
              #{order._id.slice(-6)}
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate mt-1">
            {order.user?.email || "No email"}
          </p>
        </div>

        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-3 pb-1 border-b border-gray-100">
            Order Details
          </h4>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div 
                key={idx} 
                className="grid grid-cols-12 items-center text-sm gap-2"
              >
                <span className="text-gray-700 col-span-7 truncate">
                  {item.product?.name || "Product"}
                </span>
                <span className="text-gray-500 col-span-3 text-center">
                  ₹{item.price || 0} × {item.quantity}
                </span>
                <span className="text-gray-800 font-medium col-span-2 text-right">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-4 mb-3"></div>
          <div className="flex justify-between items-center font-bold text-lg text-gray-800">
            <span>TOTAL</span>
            <span className="bg-blue-50 px-3 py-1 rounded-lg">
              ₹{order.totalPrice?.toFixed(2) || 0}
            </span>
          </div>
        </div>
      </div>

      <div className={`p-3 flex items-center justify-center gap-2 font-semibold ${statusStyles}`}>
        {isAccepted ? (
          <CheckCircle2 size={18} className="text-white" />
        ) : (
          <XCircle size={18} className="text-white" />
        )}
        <span>{isAccepted ? 'ACCEPTED' : 'REJECTED'}</span>
      </div>
    </div>
  );
};

export default OrderHistoryCard;