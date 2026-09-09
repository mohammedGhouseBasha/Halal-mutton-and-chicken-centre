import { ReactNode } from "react"; import { useAdminAuth } from "../context/AdminAuthContext"; import AdminLogin from "../pages/admin/Login";
export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAdminAuth();
  return isAuthenticated ? <>{children}</> : <AdminLogin />;
}
