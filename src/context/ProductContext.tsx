import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "../types"; import { initialProducts } from "../data/products"; import { load, save } from "../utils/storage";
import { db } from "../firebase"; import { collection, doc, setDoc, deleteDoc, onSnapshot, orderBy, query } from "firebase/firestore";
const localKey = "fresh-meat-hub-products";
const PRODUCTS_COLLECTION = "products";
type Ctx={products:Product[];upsertProduct:(p:Product)=>void;deleteProduct:(id:number)=>void};
const C=createContext<Ctx>({products:[],upsertProduct:()=>{},deleteProduct:()=>{}});
export const ProductProvider=({children}:{children:ReactNode})=>{
 const [products,setProducts]=useState<Product[]>(()=>load(localKey,initialProducts));

 // When a shared cloud database is set up, listen for every product live so
 // price/stock/availability edits show up for every customer, not just this device.
 useEffect(()=>{
  if(!db)return;
  const database=db;
  const q=query(collection(database,PRODUCTS_COLLECTION),orderBy("id","asc"));
  return onSnapshot(q,snap=>{
   if(snap.empty){initialProducts.forEach(p=>setDoc(doc(database,PRODUCTS_COLLECTION,String(p.id)),p));return}
   setProducts(snap.docs.map(d=>d.data() as Product));
  });
 },[]);

 const upsertProduct=(p:Product)=>{
  if(db){setDoc(doc(db,PRODUCTS_COLLECTION,String(p.id)),p)}
  else{setProducts(x=>{const exists=x.some(y=>y.id===p.id);const n=exists?x.map(y=>y.id===p.id?p:y):[...x,p];save(localKey,n);return n})}
 };
 const deleteProduct=(id:number)=>{
  if(db){deleteDoc(doc(db,PRODUCTS_COLLECTION,String(id)))}
  else{setProducts(x=>{const n=x.filter(y=>y.id!==id);save(localKey,n);return n})}
 };
 return <C.Provider value={{products,upsertProduct,deleteProduct}}>{children}</C.Provider>
}; export const useProducts=()=>useContext(C);
