import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Order, OrderStatus } from "../types"; import { initialOrders } from "../data/orders"; import { load, save } from "../utils/storage";
import { db } from "../firebase"; import { collection, doc, setDoc, updateDoc, onSnapshot, orderBy, query } from "firebase/firestore";
const localKey = "fresh-meat-hub-orders";
const ORDERS_COLLECTION = "orders";
type Ctx={orders:Order[];createOrder:(o:Omit<Order,"id">)=>Order;getOrder:(id:string)=>Order|undefined;updateOrderStatus:(id:string,s:OrderStatus)=>void};
const C=createContext<Ctx>({orders:[],createOrder:()=>{throw new Error()},getOrder:()=>undefined,updateOrderStatus:()=>{}});
export const OrderProvider=({children}:{children:ReactNode})=>{
 const [orders,setOrders]=useState<Order[]>(()=>load(localKey,initialOrders));

 // When a shared cloud database is set up (see .env.example), listen for every
 // order live so they show up here no matter which phone/device placed them.
 useEffect(()=>{
  if(!db)return;
  const q=query(collection(db,ORDERS_COLLECTION),orderBy("createdAt","desc"));
  return onSnapshot(q,snap=>setOrders(snap.docs.map(d=>d.data() as Order)));
 },[]);

 const createOrder=(o:Omit<Order,"id">)=>{
  const order:Order={...o,id:`FMH-${Math.floor(10000+Math.random()*89999)}`,createdAt:Date.now()};
  if(db){setDoc(doc(db,ORDERS_COLLECTION,order.id),order)}
  else{setOrders(x=>{const n=[order,...x];save(localKey,n);return n})}
  return order;
 };
 const updateOrderStatus=(id:string,status:OrderStatus)=>{
  if(db){updateDoc(doc(db,ORDERS_COLLECTION,id),{status})}
  else{setOrders(x=>{const n=x.map(o=>o.id===id?{...o,status}:o);save(localKey,n);return n})}
 };
 return <C.Provider value={{orders,createOrder,getOrder:(id)=>orders.find(o=>o.id.toUpperCase()===id.toUpperCase()),updateOrderStatus}}>{children}</C.Provider>
}; export const useOrders=()=>useContext(C);
