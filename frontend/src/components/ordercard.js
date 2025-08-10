import { useState } from 'react';
import { Check, X, User, ChevronDown } from 'lucide-react';

const OrderAcceptRejectCard = ({ order, onAccept, onReject }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg font-sans overflow-hidden"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* --- Collapsed View - Responsive --- */}
      <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-3 w-full">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200 flex-shrink-0">
            <User size={24} className="sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-800 truncate">{order.user.name}</p>
            <p className="text-sm text-gray-500 truncate">{order.user.email}</p>
            <p className="text-sm text-gray-500 truncate">{order.user.phone}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={(e) => handleButtonClick(e, () => onReject(order._id))}
              className="p-1 sm:p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
              aria-label="Reject Order"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={(e) => handleButtonClick(e, () => onAccept(order._id))}
              className="p-1 sm:p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition"
              aria-label="Accept Order"
            >
              <Check size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
          <ChevronDown
            className={`text-gray-400 transform transition-transform duration-300 min-w-[24px] ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {/* --- Expanded View - Responsive --- */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4">
          <h4 className="font-semibold mb-2 text-gray-600">Order Details:</h4>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.product?._id || item._id} className="w-full">
                {/* Mobile view */}
                <div className="sm:hidden flex flex-col">
                  <span className="text-gray-700 truncate">
                    {item.product?.name || 'Product not available'}
                  </span>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-500">
                      ₹{item.price} × {item.quantity}
                    </span>
                    <span className="text-gray-800 font-medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                {/* Desktop view */}
                <div className="hidden sm:grid grid-cols-3 items-center text-sm">
                  <span className="text-gray-700 col-span-1 truncate">
                    {item.product?.name || 'Product not available'}
                  </span>
                  <span className="text-gray-500 col-span-1 text-center">
                    ₹{item.price} × {item.quantity}
                  </span>
                  <span className="text-gray-800 font-medium col-span-1 text-right">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 my-3"></div>
          <div className="flex justify-between font-bold text-base sm:text-lg text-gray-800">
            <span>TOTAL</span>
            <span>₹{order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderAcceptRejectCard;