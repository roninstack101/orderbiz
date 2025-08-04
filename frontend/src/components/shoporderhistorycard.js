export default function HistoryCard({ order }) {
  const statusColor = order.status === "ACCEPTED" ? "bg-green-500" : "bg-red-500";

  return (
    <div className="bg-[#e0ecff] rounded-3xl p-6 max-w-md mx-auto shadow-md">
      {/* Customer Info */}
      <div className="bg-white rounded-2xl p-5">
        <p className="font-semibold text-black">Name: <span className="font-normal">{order.name}</span></p>
        <p className="font-semibold text-black">Order ID: <span className="font-normal">{order.orderId}</span></p>
        <p className="font-semibold text-black">Email: <span className="font-normal">{order.email}</span></p>
        <p className="font-semibold text-black">Phone: <span className="font-normal">{order.phone}</span></p>

        {/* Order List */}
        <div className="mt-4">
          <h3 className="font-bold text-lg text-black mb-2">Order</h3>
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-black">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          {/* Divider */}
          <hr className="my-3 border-black" />

          {/* Total */}
          <div className="flex justify-between font-semibold text-black">
            <span>Total</span>
            <span>₹{order.total}</span>
          </div>
        </div>

        {/* Status Tag */}
        <div className={`mt-5 ${statusColor} text-white text-center py-3 rounded-2xl text-lg font-bold`}>
          {order.status}
        </div>
      </div>
    </div>
  );
}
