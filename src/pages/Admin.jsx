import React, { useEffect, useState } from "react";
import {
  Package,
  Scan,
  Calendar,
  DollarSign,
  Clock,
  IndianRupee,
} from "lucide-react";
import axios from "axios";

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "https://foodx-backend-tjc7.onrender.com/api/user/orders"
      );
      if (res.data?.status) {
        setOrders(res.data.orders);
      } else {
        console.error("Failed to load orders:", res.data.message);
      }
    } catch (err) {
      console.error("API Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  const handleScanQR = (orderId) => {
    console.log("Scan QR for Order ID:", orderId);
    // Optional: navigate to /scan/:orderId or open modal
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage orders and track sales</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            icon={<Package className="w-6 h-6 text-blue-600" />}
            label="Total Orders"
            value={orders.length}
            bgColor="bg-blue-100"
          />
          <Card
            icon={<IndianRupee className="w-6 h-6 text-green-600" />}
            label="Total Revenue"
            value={`₹${totalRevenue.toFixed(2)}`}
            bgColor="bg-green-100"
          />
          <Card
            icon={<Clock className="w-6 h-6 text-purple-600" />}
            label="Avg Order Value"
            value={`₹${
              orders.length > 0
                ? (totalRevenue / orders.length).toFixed(2)
                : "0.00"
            }`}
            bgColor="bg-purple-100"
          />
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          </div>

          {loading ? (
            <div className="p-6 text-gray-500 text-center">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-600">
                Orders will appear here once customers start purchasing.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {order._id}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="ml-13">
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Items:
                          </h4>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-gray-600">
                                  {item.name} × {item.quantity}
                                </span>
                                <span className="font-medium">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">
                            Total: ₹{order.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-6">
                      <button
                        onClick={() => handleScanQR(order._id)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                      >
                        <Scan className="w-4 h-4" />
                        <span>Scan QR</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable dashboard card component
const Card = ({ icon, label, value, bgColor }) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <div className="flex items-center">
      <div
        className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}
      >
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default Admin;
