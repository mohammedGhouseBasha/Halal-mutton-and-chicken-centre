import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "../types"; import { initialProducts } from "../data/products"; import { load, save } from "../utils/storage";
import { db } from "../firebase"; import { collection, doc, setDoc, deleteDoc, onSnapshot, orderBy, query, runTransaction } from "firebase/firestore";
const localKey = "fresh-meat-hub-products";
const PRODUCTS_COLLECTION = "products";
export type StockShortage = { name: string; availableKg: number };
export type ReserveResult = { ok: true } | { ok: false; shortages: StockShortage[] };
type Ctx={products:Product[];upsertProduct:(p:Product)=>void;deleteProduct:(id:number)=>void;reserveStock:(items:{productId:number;weightKg:number}[])=>Promise<ReserveResult>};
const C=createContext<Ctx>({products:[],upsertProduct:()=>{},deleteProduct:()=>{},reserveStock:async()=>({ok:true})});
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

 // Combines duplicate cart lines for the same product, then takes the ordered
 // weight off that product's stock — using a transaction on the cloud database
 // so two customers ordering the last kg at the same moment can't both succeed.
 const reserveStock=async(items:{productId:number;weightKg:number}[]):Promise<ReserveResult>=>{
  const needed=new Map<number,number>();
  items.forEach(i=>needed.set(i.productId,(needed.get(i.productId)||0)+i.weightKg));
  const ids=[...needed.keys()];

  if(db){
   const database=db;
   let shortages:StockShortage[]=[];
   try{
    await runTransaction(database,async tx=>{
     shortages=[];
     const refs=ids.map(id=>doc(database,PRODUCTS_COLLECTION,String(id)));
     const snaps=await Promise.all(refs.map(r=>tx.get(r)));
     snaps.forEach((snap,i)=>{
      const want=needed.get(ids[i])!; const data=snap.data() as Product|undefined;
      if(!data||data.stockKg<want)shortages.push({name:data?.name||"A product in your cart",availableKg:data?.stockKg||0});
     });
     if(shortages.length)throw new Error("INSUFFICIENT_STOCK");
     snaps.forEach((snap,i)=>{
      const want=needed.get(ids[i])!; const data=snap.data() as Product;
      const stockKg=data.stockKg-want;
      tx.update(refs[i],{stockKg,available:stockKg>0});
     });
    });
    return {ok:true};
   }catch{
    if(shortages.length)return {ok:false,shortages};
    return {ok:false,shortages:[{name:"your order",availableKg:0}]};
   }
  }

  let shortages:StockShortage[]=[];
  setProducts(x=>{
   shortages=[];
   for(const id of ids){const p=x.find(y=>y.id===id);const want=needed.get(id)!;if(!p||p.stockKg<want)shortages.push({name:p?.name||"A product in your cart",availableKg:p?.stockKg||0})}
   if(shortages.length)return x;
   const n=x.map(p=>needed.has(p.id)?{...p,stockKg:p.stockKg-needed.get(p.id)!,available:p.stockKg-needed.get(p.id)!>0}:p);
   save(localKey,n);
   return n;
  });
  return shortages.length?{ok:false,shortages}:{ok:true};
 };

 return <C.Provider value={{products,upsertProduct,deleteProduct,reserveStock}}>{children}</C.Provider>
}; export const useProducts=()=>useContext(C);
