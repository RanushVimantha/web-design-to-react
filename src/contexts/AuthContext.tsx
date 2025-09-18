import React, { createContext, useContext, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const apiBase = import.meta.env.VITE_API_URL; // set this in your React .env

  const login = async (email: string, password: string) => {
    const res = await fetch(`${apiBase}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    const data = await res.json();
    setUser(data.user);
    if (data.token) localStorage.setItem("authToken", data.token);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch(`${apiBase}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error("Registration failed");
    const data = await res.json();
    setUser(data.user);
    if (data.token) localStorage.setItem("authToken", data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
  };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
