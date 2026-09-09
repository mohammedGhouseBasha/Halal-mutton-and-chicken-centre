import { createContext, useContext, useState, ReactNode } from "react";
import { load, save } from "../utils/storage";
const key = "fresh-meat-hub-admin-auth";
const ADMIN_PASSWORD = "halalcenteradmin";
type Ctx = {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
};
const C = createContext<Ctx>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
});
export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    load(key, false),
  );
  const login = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      save(key, true);
      return true;
    }
    return false;
  };
  const logout = () => {
    setIsAuthenticated(false);
    save(key, false);
  };
  return (
    <C.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </C.Provider>
  );
};
export const useAdminAuth = () => useContext(C);
