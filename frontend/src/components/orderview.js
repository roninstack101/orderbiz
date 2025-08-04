import { useState } from "react";
import { History, ListOrdered } from "lucide-react";
import OrderAcceptRejectCard from "./ordercard.js";
import OrderHistoryCard from "./shoporderhistorycard.js";

const OrdersView = ({
  pendingOrders,
  historyOrders,
  handleAccept,
  handleReject,
}) => {
  const [view, setView] = useState("available");
  return (
    <div className="relative pb-20">
      {view === "available" ? (
        pendingOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingOrders.map((order) => (
              <OrderAcceptRejectCard
                key={order._id}
                order={order}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8 py-8">
            No available orders.
          </p>
        )
      ) : historyOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {historyOrders.map((order) => (
            <OrderHistoryCard key={order._id} order={order} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8 py-8">No order history.</p>
      )}
      <button
        onClick={() =>
          setView((prev) => (prev === "available" ? "history" : "available"))
        }
        className="fixed bottom-12 right-12 bg-white text-blue-600 font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-gray-50 flex items-center gap-2 z-20 border border-gray-200"
      >
        {view === "available" ? (
          <History size={20} />
        ) : (
          <ListOrdered size={20} />
        )}
        {view === "available" ? "History" : "Available Orders"}
      </button>
    </div>
  );
};

export default OrdersView;
