// src/context/AuthContext.jsx
import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // initial loading

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("ctm_token", res.data.token);
    setUser(res.data.user);
  };

  const signup = async (data) => {
    const res = await api.post("/auth/signup", data);
    localStorage.setItem("ctm_token", res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("ctm_token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("ctm_token");

    // No token → no fetch → show UI immediately
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.log("fetchMe failed, removing token");
        localStorage.removeItem("ctm_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
