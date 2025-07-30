import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // Snack state
  const [snacks, setSnacks] = useState([]);
  const [snackLoading, setSnackLoading] = useState(true);
  const [snackError, setSnackError] = useState("");

  // Cart state
  const [cartItems, setCartItems] = useState([]);

  // Order state
  const [orders, setOrders] = useState([]);

  // Fetch snacks from API
  const fetchSnacks = async () => {
    try {
      const res = await axios.get(
        "https://foodx-backend-tjc7.onrender.com/api/snacks"
      );
      setSnacks(res.data.snacks);
    } catch (error) {
      console.error("Error fetching snacks:", error);
      setSnackError("Failed to load snacks.");
    } finally {
      setSnackLoading(false);
    }
  };

  useEffect(() => {
    fetchSnacks();
  }, []);

  const verifyToken = async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        const response = await axios.post(
          "https://foodx-backend-tjc7.onrender.com/api/auth/user",
          { token },
          { withCredentials: true }
        );

        const { success, user } = response.data;
        console.log(success, user);
        if (success) {
          setIsLoggedIn(true);
          user?._id && localStorage.setItem("userId", user._id);
          user?.username && setUsername(user.username);
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem("userId");
        }
      }
    } catch (error) {
      console.error("Token verification failed:", error.message);
      setIsLoggedIn(false);

      localStorage.removeItem("userId");
    }
  };

  const login = async (email, password, userType) => {
    try {
      const response = await axios.post(
        "https://foodx-backend-tjc7.onrender.com/api/auth/login",
        { email, password, userType },
        { withCredentials: true }
      );

      const { jwt, id, username, success, message } = response.data;
      console.log("Login response:", message);

      if (success) {
        localStorage.setItem("token", jwt);
        localStorage.setItem("userId", id);
        localStorage.setItem("userType", userType);

        setIsLoggedIn(true);
        setUsername(username || email);

        return { status: true };
      } else {
        return { status: false, message: message || "Login failed" };
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      return {
        status: false,
        message: err.response?.data?.message || "An unexpected error occurred",
      };
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    setUsername("");
    setCartItems([]);
  };

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem._id === item._id
      );
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== itemId)
    );
  };

  const updateQuantity = (itemId, quantity) => {
    console.log(quantity);
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Order functions
  const placeOrder = () => {
    const orderId = `ORDER-${Date.now()}`;
    const order = {
      id: orderId,
      items: [...cartItems],
      total: cartTotal,
      timestamp: new Date(),
      qrCode: orderId,
    };

    setOrders((prevOrders) => [...prevOrders, order]);
    clearCart();
    return orderId;
  };

  const value = {
    // Auth
    isLoggedIn,
    username,
    login,
    logout,

    // Snacks
    snacks,
    snackLoading,
    snackError,
    verifyToken,
    // Cart
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,

    // Orders
    orders,
    placeOrder,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
