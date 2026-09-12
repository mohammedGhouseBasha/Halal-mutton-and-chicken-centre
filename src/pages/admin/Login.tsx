import { FormEvent, useState } from "react"; import { Lock } from "lucide-react"; import { Button } from "../../components/ui"; import { useAdminAuth } from "../../context/AdminAuthContext"; import { useToast } from "../../context/ToastContext"; import { isFirebaseConfigured } from "../../firebase";
export default function AdminLogin() {
  const { login } = useAdminAuth(); const { showToast } = useToast();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [submitting, setSubmitting] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    const ok = await login(isFirebaseConfigured ? email : password, password);
    setSubmitting(false);
    if (!ok) showToast(isFirebaseConfigured ? "Incorrect email or password" : "Incorrect password", "error");
  };
  return <div className="page"><div className="container narrow"><div className="page-title"><span className="eyebrow">ADMIN</span><h1>Admin Login</h1><p>{isFirebaseConfigured ? "Sign in with your admin account to continue." : "Enter the admin password to continue."}</p></div><form className="form-card" onSubmit={submit}>{isFirebaseConfigured && <label>Email<input type="email" autoFocus value={email} onChange={e => setEmail(e.target.value)} /></label>}<label>Password<input type="password" autoFocus={!isFirebaseConfigured} value={password} onChange={e => setPassword(e.target.value)} /></label><Button type="submit" className="full" disabled={submitting}><Lock size={16} /> {submitting ? "Signing in..." : "Login"}</Button></form></div></div>;
}
