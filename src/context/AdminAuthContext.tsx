import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { load, save } from "../utils/storage";

const key = "fresh-meat-hub-admin-auth";
// Only used when Firebase isn't configured at all (see .env.example) — a
// single-browser local demo mode with no real backend to protect.
const LOCAL_ADMIN_PASSWORD = "halalcenteradmin";

type Ctx = {
  isAuthenticated: boolean;
  loading: boolean;
  login: (identifier: string, password?: string) => Promise<boolean>;
  logout: () => void;
};
const C = createContext<Ctx>({
  isAuthenticated: false,
  loading: false,
  login: async () => false,
  logout: () => {},
});

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !auth && load(key, false));
  const [loading, setLoading] = useState<boolean>(Boolean(auth));

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, user => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
  }, []);

  const login = async (identifier: string, password = "") => {
    if (auth) {
      try {
        await signInWithEmailAndPassword(auth, identifier, password);
        return true;
      } catch {
        return false;
      }
    }
    if (identifier === LOCAL_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      save(key, true);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (auth) { signOut(auth); return; }
    setIsAuthenticated(false);
    save(key, false);
  };

  return (
    <C.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </C.Provider>
  );
};
export const useAdminAuth = () => useContext(C);
