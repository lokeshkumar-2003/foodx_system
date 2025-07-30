import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Home, Package } from "lucide-react";
import QRCode from "react-qr-code";
import axios from "axios";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const handleInvoiceDownload = async (orderId) => {
    try {
      const response = await axios.get(
        `https://foodx-backend-tjc7.onrender.com/api/invoice/recipet/${orderId}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      navigate("/home");
    } catch (error) {
      console.error("Error downloading the invoice:", error);
      alert("Failed to download invoice.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-center">
            <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-green-100">Thank you for your purchase</p>
          </div>

          {/* Order Details */}
          <div className="p-6">
            <div className="text-center mb-8">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Package className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">
                    Order ID
                  </span>
                </div>
                <p className="text-lg font-mono font-bold text-gray-900">
                  {orderId}
                </p>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Order QR Code
              </h2>
              <p className="text-gray-600 mb-6">
                Present this QR code for order pickup or verification
              </p>

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                  <QRCode
                    size={200}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={orderId || "ORDER-DEFAULT"}
                    viewBox={`0 0 256 256`}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Next Steps:</strong>
                  <br />
                  • Save this QR code to your phone
                  <br />
                  • Visit our pickup location
                  <br />• Show the QR code to our staff
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleInvoiceDownload(orderId)}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
              >
                <Home className="w-4 h-4" />
                <span>Download Receipt</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
