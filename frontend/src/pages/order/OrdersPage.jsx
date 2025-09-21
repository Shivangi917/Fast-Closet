import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getOrderById, getOrdersByUser } from "../../utils/api/order.api.js";
import { Link } from "react-router-dom";

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      getOrdersByUser(user.id).then(setOrders).catch(console.error);
    }
  }, [user]);

  const getOrderByIds = async (orderId) => {
    const res = await getOrderById(orderId);
    console.log(res);
  }

  if (!orders.length) return <p className="p-6">No orders yet</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Your Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => (
            <>
            <button className="mb-10" onClick={() => getOrderByIds(order._id)}>HELLO</button>
          <Link to={`/order/${order._id}`} key={order._id}>
            <div className="border p-4 rounded-lg shadow bg-white hover:scale-105 transition-transform cursor-pointer">
              <h3 className="text-lg font-semibold mb-2">
                Order #{order._id.slice(-6).toUpperCase()}
              </h3>
              <p>Status: <span className="font-bold">{order.orderStatus}</span></p>
              <p>Payment: <span className="font-bold">{order.paymentStatus}</span></p>
              <p>Total: ₹{order.totalAmount}</p>

              <div className="mt-3 space-y-2">
                {order.items.map((i) => (
                  <div key={i.product._id} className="flex items-center space-x-4">
                    <img
                      src={i.product.images?.[0] || "/placeholder.png"}
                      alt={i.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{i.product.name}</p>
                      <p>Qty: {i.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Link></>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
