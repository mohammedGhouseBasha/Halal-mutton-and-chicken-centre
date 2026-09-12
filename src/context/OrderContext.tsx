import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Order, OrderStatus } from "../types"; import { initialOrders } from "../data/orders"; import { load, save } from "../utils/storage";
import { db } from "../firebase"; import { collection, doc, getDoc, setDoc, updateDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { useAdminAuth } from "./AdminAuthContext";
const localKey = "fresh-meat-hub-orders";
const ORDERS_COLLECTION = "orders";
type Ctx={orders:Order[];createOrder:(o:Omit<Order,"id">)=>Order;getOrderById:(id:string)=>Promise<Order|undefined>;updateOrderStatus:(id:string,s:OrderStatus)=>void};
const C=createContext<Ctx>({orders:[],createOrder:()=>{throw new Error()},getOrderById:async()=>undefined,updateOrderStatus:()=>{}});
export const OrderProvider=({children}:{children:ReactNode})=>{
 const [orders,setOrders]=useState<Order[]>(()=>load(localKey,initialOrders));
 const {isAuthenticated}=useAdminAuth();

 // The full order list (every customer's name/phone/address) is only needed
 // by the admin dashboard, so it's only fetched once signed in as admin —
 // Firestore rules also enforce this server-side (only `get` by id is public,
 // `list` requires the admin account). Customer-facing lookups use
 // getOrderById below instead of reading this array.
 useEffect(()=>{
  if(!db||!isAuthenticated)return;
  const q=query(collection(db,ORDERS_COLLECTION),orderBy("createdAt","desc"));
  return onSnapshot(q,snap=>setOrders(snap.docs.map(d=>d.data() as Order)));
 },[isAuthenticated]);

 const createOrder=(o:Omit<Order,"id">)=>{
  const order:Order={...o,id:`FMH-${Math.floor(10000+Math.random()*89999)}`,createdAt:Date.now()};
  // Firestore rejects any field that is exactly `undefined` (e.g. an item with
  // no special instructions typed in) — this strips those out before saving.
  if(db){setDoc(doc(db,ORDERS_COLLECTION,order.id),JSON.parse(JSON.stringify(order)))}
  else{setOrders(x=>{const n=[order,...x];save(localKey,n);return n})}
  return order;
 };
 const getOrderById=async(id:string):Promise<Order|undefined>=>{
  const cached=orders.find(o=>o.id.toUpperCase()===id.toUpperCase());
  if(cached)return cached;
  if(!db)return undefined;
  const snap=await getDoc(doc(db,ORDERS_COLLECTION,id.toUpperCase()));
  return snap.exists()?snap.data() as Order:undefined;
 };
 const updateOrderStatus=(id:string,status:OrderStatus)=>{
  if(db){updateDoc(doc(db,ORDERS_COLLECTION,id),{status})}
  else{setOrders(x=>{const n=x.map(o=>o.id===id?{...o,status}:o);save(localKey,n);return n})}
 };
 return <C.Provider value={{orders,createOrder,getOrderById,updateOrderStatus}}>{children}</C.Provider>
}; export const useOrders=()=>useContext(C);
