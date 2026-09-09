import { FormEvent, useState } from "react"; import { Lock } from "lucide-react"; import { Button } from "../../components/ui"; import { useAdminAuth } from "../../context/AdminAuthContext"; import { useToast } from "../../context/ToastContext";
export default function AdminLogin() {
  const { login } = useAdminAuth(); const { showToast } = useToast();
  const [password, setPassword] = useState("");
  const submit = (e: FormEvent) => { e.preventDefault(); if (!login(password)) showToast("Incorrect password", "error"); };
  return <div className="page"><div className="container narrow"><div className="page-title"><span className="eyebrow">ADMIN</span><h1>Admin Login</h1><p>Enter the admin password to continue.</p></div><form className="form-card" onSubmit={submit}><label>Password<input type="password" autoFocus value={password} onChange={e => setPassword(e.target.value)} /></label><Button type="submit" className="full"><Lock size={16} /> Login</Button></form></div></div>;
}
