import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../utils/api/order.api.js";
import { Link } from "react-router-dom";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrderById(id)
      .then(setOrder)
      .catch(console.error);
  }, [id]);

  if (!order) return <p className="p-6">Loading order...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Order Details</h2>

      {/* Order Info */}
      <div className="border p-4 rounded-lg shadow bg-white mb-6">
        <p>
          <strong>Order ID:</strong> #{order._id.slice(-6).toUpperCase()}
        </p>
        <p>
          <strong>Order Status:</strong> {order.orderStatus}
        </p>
        <p>
          <strong>Payment Status:</strong> {order.paymentStatus}
        </p>
        <p>
          <strong>Payment Method:</strong> {order.paymentMethod}
        </p>
        <p>
          <strong>Total Amount:</strong> ₹{order.totalAmount}
        </p>
        <p>
          <strong>Ordered On:</strong>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Customer Info */}
      <div className="border p-4 rounded-lg shadow bg-white mb-6">
        <h3 className="text-lg font-semibold mb-2">Customer Details</h3>
        <p><strong>Name:</strong> {order.customer.name}</p>
        <p><strong>Email:</strong> {order.customer.email}</p>
        <p><strong>Phone:</strong> {order.customer.phone || "N/A"}</p>
      </div>

      {/* Store Info */}
      <div className="border p-4 rounded-lg shadow bg-white mb-6">
        <h3 className="text-lg font-semibold mb-2">Store Details</h3>
        <p><strong>Name:</strong> {order.store.name}</p>
        <p><strong>Contact:</strong> {order.store.contactNumber}</p>
        <p><strong>Address:</strong> {order.store.address.street}, {order.store.address.city}, {order.store.address.state} - {order.store.address.postalCode}, {order.store.address.country}</p>
      </div>

      {/* Items */}
      <div className="border p-4 rounded-lg shadow bg-white">
        <h3 className="text-lg font-semibold mb-2">Items</h3>
        {order.items.map((item, idx) => (
          <div>
            <div key={idx} className="flex items-center space-x-4 mb-3">
              <img
                src={item.product.images?.[0] || "/placeholder.png"}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p>Qty: {item.quantity}</p>
                <p>Price: ₹{item.price}</p>
              </div>
            </div>
            <button className="bg-teal-700 text-white hover:bg-teal-800 hover:scale-105 px-3 py-1 rounded">
              <Link to={`/product/${item.product._id}`}
              >
                Go To Product
              </Link>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetailsPage;
