import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, LogOut, Home } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";

const Navbar = () => {
  const { isLoggedIn, username, logout, cartItems = [] } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Directly read userType from localStorage for immediate access
  const userType = localStorage.getItem("userType");
  const isStudent = userType === "student";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (!isLoggedIn) return null;

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-xl text-gray-800">FoodX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isStudent && (
              <NavLink
                path="/home"
                icon={<Home className="w-4 h-4" />}
                label="Home"
                location={location}
              />
            )}
            {isStudent && (
              <NavLink
                path="/cart"
                icon={<ShoppingCart className="w-4 h-4" />}
                label="Cart"
                location={location}
                showBadge={cartItemCount}
              />
            )}
          </div>

          {/* User Info + Logout */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{username || "User"}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3 flex justify-around">
          {isStudent && (
            <MobileNavLink
              path="/home"
              icon={<Home className="w-5 h-5" />}
              label="Home"
              location={location}
              showBadge={0}
            />
          )}
          {isStudent && (
            <MobileNavLink
              path="/cart"
              icon={<ShoppingCart className="w-5 h-5" />}
              label="Cart"
              location={location}
              showBadge={cartItemCount}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// Desktop NavLink
const NavLink = ({ path, icon, label, location, showBadge = 0 }) => (
  <Link
    to={path}
    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path
        ? "text-blue-600 bg-blue-50"
        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
    }`}
  >
    {icon}
    <span>{label}</span>
    {showBadge > 0 && (
      <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {showBadge}
      </span>
    )}
  </Link>
);

// Mobile NavLink
const MobileNavLink = ({ path, icon, label, location, showBadge = 0 }) => (
  <Link
    to={path}
    className={`flex flex-col items-center py-2 px-3 rounded-md transition-colors relative ${
      location.pathname === path ? "text-blue-600 bg-blue-50" : "text-gray-600"
    }`}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
    {showBadge > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {showBadge}
      </span>
    )}
  </Link>
);
