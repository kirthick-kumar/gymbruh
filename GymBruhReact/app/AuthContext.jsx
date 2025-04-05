import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(null);
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthData = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");

      if (storedToken) setTokenState(storedToken);
      if (storedUser) setUserState(JSON.parse(storedUser));

      setLoading(false);
    };

    loadAuthData();
  }, []);

  const setToken = async (newToken) => {
    setTokenState(newToken);
    await AsyncStorage.setItem("token", newToken);
  };

  const setUser = async (userData) => {
    setUserState(userData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    setTokenState(null);
    setUserState(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ token, setToken, logout, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
  