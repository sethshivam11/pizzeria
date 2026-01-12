import { createContext, useContext, useEffect, useState } from "react";
import { AxiosError } from "axios";
import api from "../lib/axios";
import { useLocation, useNavigate } from "react-router-dom";

const initialState = {
  user: {
    _id: "",
    name: "",
    email: "",
    phone: "",
  },
  loading: true,
  getUser: () => {},
  login: () => {},
  signUp: () => {},
  logOut: () => {},
};

const UserContext = createContext(initialState);

const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(initialState.user);
  const [loading, setLoading] = useState(initialState.loading);

  const login = async (creds) => {
    try {
      const { data } = await api.post("/users/login", creds, {
        withCredentials: true,
      });

      if (data?.success) {
        setUser(data.data);
        localStorage.setItem("token", data.data.token);
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

  const signUp = async (creds) => {
    try {
      const { data } = await api.post("/users/signup", creds);
      if (data?.success) {
        setUser(data.data);
        localStorage.setItem("token", data.data.token);
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

  const logOut = async () => {
    try {
      const { data } = await api.get("/users/logout");
      if (data?.success) {
        setUser(initialState.user);
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

  const getUser = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users");
      if (data?.success) {
        setUser(data.data);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user._id) return;
    const token = localStorage.getItem("token");
    if (token) {
      getUser();
    } else if (location.pathname.includes("/cart")) {
      navigate("/login");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, loading, login, signUp, getUser, logOut }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => useContext(UserContext);

export { useUser, UserContext };

export default UserProvider;
