import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) setTokenState(storedToken);
      setLoading(false); // Set loading to false once token is loaded
    };
    loadToken();
  }, []);

  const setToken = async (newToken) => {
    setTokenState(newToken);
    await AsyncStorage.setItem("token", newToken);
  };

  const logout = async () => {
    setTokenState(null);
    await AsyncStorage.removeItem("token");
  };

  if (loading) return null; // Prevent rendering until token is loaded

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
