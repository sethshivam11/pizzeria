import { createContext, useContext, useEffect } from "react";
import { AxiosError } from "axios";
import { useState } from "react";
import api from "../lib/axios";
import { useUser } from "./UserProvider";

const initialState = {
  cart: {
    user: "",
    pizzas: [],
    ingredients: [],
  },
  count: 0,
  loading: true,
  getCart: () => {},
  addToCart: () => {},
  updateCount: () => {},
  removeFromCart: () => {},
};

const CartContext = createContext(initialState);

const CartProvider = ({ children }) => {
  const { user } = useUser();

  const [cart, setCart] = useState(initialState.cart);
  const [loading, setLoading] = useState(initialState.loading);
  const [count, setCount] = useState(0);

  const getCart = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/cart");
      if (data?.success) {
        setCart(data.data);
        setCount(data.data.pizzas.length + data.data.ingredients.length);
        return data;
      }
    } catch (error) {
      let message = "Something went wrong";
      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
        console.log(message);
      } else {
        console.log(error);
      }
      if (message === "Cart not found") {
        return { success: true, message: "No items in your cart" };
      }
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (items, type) => {
    try {
      const { data } = await api.post("/cart", {
        items,
        type,
      });
      if (data?.success) {
        setCart(data.data);
        setCount(data.data.pizzas.length + data.data.ingredients.length);
        return data;
      }
    } catch (error) {
      let message = "Something went wrong";
      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
        console.log(message);
      } else {
        console.log(error);
      }
      return { success: false, message };
    }
  };

  const updateCount = async (itemId, type, count) => {
    try {
      const { data } = await api.put("/cart", {
        item: itemId,
        type,
        count,
      });
      if (data?.success) {
        setCart(data.data);
        setCount(data.data.pizzas.length + data.data.ingredients.length);
        return data;
      }
    } catch (error) {
      let message = "Something went wrong";
      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
        console.log(message);
      } else {
        console.log(error);
      }
      return { success: false, message };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const { data } = await api.delete(`/cart/${itemId}`);
      if (data?.success) {
        setCart(data.data);
        setCount(data.data.pizzas.length + data.data.ingredients.length);
        return data;
      }
    } catch (error) {
      let message = "Something went wrong";
      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
        console.log(message);
      } else {
        console.log(error);
      }
      return { success: false, message };
    }
  };

  useEffect(() => {
    if (!user._id) return;
    getCart();
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        count,
        loading,
        getCart,
        addToCart,
        updateCount,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

export { CartContext, useCart };

export default CartProvider;
