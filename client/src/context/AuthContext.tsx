import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  loginRequest,
  meRequest,
  registerRequest,
  type LoginData,
  type RegisterData,
  type User,
} from "../api/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    meRequest()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(data: LoginData) {
    const res = await loginRequest(data);
    localStorage.setItem("token", res.token);
    setUser(res.user);
    return res.user;
  }

  async function register(data: RegisterData) {
    const res = await registerRequest(data);
    localStorage.setItem("token", res.token);
    setUser(res.user);
    return res.user;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}
