import { useState } from 'react';
import { Check, X, User, ChevronDown } from 'lucide-react';


const OrderAcceptRejectCard = ({ order, onAccept, onReject }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Stop click propagation on buttons to prevent the card from toggling
  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg font-sans"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* --- Collapsed View --- */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
            <User size={32} className="text-gray-400" />
          </div>
          <div>
            <p className="font-bold text-gray-800">{order.user.name}</p>
            <p className="text-sm text-gray-500">{order.user.email}</p>
            <p className="text-sm text-gray-500">{order.user.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => handleButtonClick(e, () => onReject(order._id))}
            className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
            aria-label="Reject Order"
          >
            <X size={20} />
          </button>
          <button
            onClick={(e) => handleButtonClick(e, () => onAccept(order._id))}
            className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition"
            aria-label="Accept Order"
          >
            <Check size={20} />
          </button>
          <ChevronDown
            className={`text-gray-400 transform transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {/* --- Expanded View --- */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4">
          <h4 className="font-semibold mb-2 text-gray-600">Order Details:</h4>
           <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.product._id} className="grid grid-cols-3 items-center text-sm">
                <span className="text-gray-700 col-span-1 truncate">{item.product.name}</span>
                <span className="text-gray-500 col-span-1 text-center">₹{item.price} x {item.quantity}</span>
                <span className="text-gray-800 font-medium col-span-1 text-right">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 my-3"></div>
          <div className="flex justify-between font-bold text-lg text-gray-800">
            <span>TOTAL</span>
            <span>₹{order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderAcceptRejectCard;