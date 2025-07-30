import { ShoppingCart } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { addToCart, snacks, snackLoading, snackError } = useAppContext();
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType == "admin") {
      navigate("/admin");
    }
  }, []);

  if (snackLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading snacks...</p>
      </div>
    );
  }

  if (snackError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-600">
          Failed to load snacks: {snackError}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Delicious Snacks
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our amazing selection of premium snacks, carefully curated
            for your enjoyment.
          </p>
        </div>

        {/* Snack Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {snacks.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {snacks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No snacks available
            </h3>
            <p className="text-gray-600">
              Check back later for delicious treats!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
