import { createContext,useContext,useEffect,useMemo,useState,ReactNode } from "react";
import { CartItem, Product } from "../types";
import { load,save } from "../utils/storage";
import { useToast } from "./ToastContext";
type Ctx={items:CartItem[];addToCart:(p:Product,w:number,cut:string,instructions?:string)=>void;removeFromCart:(id:string)=>void;updateQuantity:(id:string,q:number)=>void;clearCart:()=>void;total:number;count:number};
const C=createContext<Ctx>({items:[],addToCart:()=>{},removeFromCart:()=>{},updateQuantity:()=>{},clearCart:()=>{},total:0,count:0});
export const CartProvider=({children}:{children:ReactNode})=>{
 const [items,setItems]=useState<CartItem[]>(()=>load("fresh-meat-hub-cart",[])); const {showToast}=useToast();
 useEffect(()=>save("fresh-meat-hub-cart",items),[items]);
 const addToCart=(p:Product,w:number,cut:string,instructions?:string)=>{const id=`${p.id}-${w}-${cut}-${instructions||""}`;setItems(x=>{const found=x.find(i=>i.id===id);return found?x.map(i=>i.id===id?{...i,quantity:i.quantity+1}:i):[...x,{id,productId:p.id,name:p.name,image:p.image,cut,weight:w,quantity:1,pricePerKg:p.pricePerKg,instructions}]});showToast("Product added to cart");};
 const removeFromCart=(id:string)=>{setItems(x=>x.filter(i=>i.id!==id));showToast("Product removed","info")};
 const updateQuantity=(id:string,q:number)=>setItems(x=>q<1?x.filter(i=>i.id!==id):x.map(i=>i.id===id?{...i,quantity:q}:i));
 const total=useMemo(()=>items.reduce((s,i)=>s+i.pricePerKg*i.weight*i.quantity,0),[items]); const count=items.reduce((s,i)=>s+i.quantity,0);
 return <C.Provider value={{items,addToCart,removeFromCart,updateQuantity,clearCart:()=>setItems([]),total,count}}>{children}</C.Provider>
};
export const useCart=()=>useContext(C);