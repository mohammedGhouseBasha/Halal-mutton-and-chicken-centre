import { createContext, useContext, useState, ReactNode } from "react";
type Toast = { id:number; message:string; type:"success"|"error"|"info" };
const C = createContext<{showToast:(message:string,type?:Toast["type"])=>void}>({showToast:()=>{}});
export const ToastProvider = ({children}:{children:ReactNode}) => {
  const [toasts,setToasts] = useState<Toast[]>([]);
  const showToast=(message:string,type:Toast["type"]="success")=>{
    const id=Date.now(); setToasts(t=>[...t,{id,message,type}]); setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),2800);
  };
  return <C.Provider value={{showToast}}>{children}<div className="toast-stack">{toasts.map(t=><div key={t.id} className={`toast ${t.type}`}>{t.message}</div>)}</div></C.Provider>;
};
export const useToast=()=>useContext(C);