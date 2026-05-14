import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ag_admin_token");
    if (!token) {
      setChecking(false);
      return;
    }
    api
      .get("/auth/me")
      .then((r) => setAdmin(r.data))
      .catch(() => {
        localStorage.removeItem("ag_admin_token");
        setAdmin(null);
      })
      .finally(() => setChecking(false));
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post("/auth/login", { username, password });
    localStorage.setItem("ag_admin_token", data.token);
    setAdmin({ username: data.username });
    return data;
  };

  const logout = () => {
    localStorage.removeItem("ag_admin_token");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
