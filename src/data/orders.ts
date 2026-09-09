import { Order } from "../types";
export const initialOrders: Order[] = [
  {
    id: "FMH-10245", customerName: "Rahul Kumar", phone: "9876543210",
    address: "12 Main Market Road, Chennai", items: [{ id:"demo-1",productId:1,name:"Mutton Curry Cut",image:"",cut:"Curry Cut",weight:1,quantity:1,pricePerKg:850 }],
    subtotal:850, deliveryCharge:50, discount:0,total:900,paymentMethod:"Cash on Delivery",deliveryMethod:"Home Delivery",status:"Preparing",date:"2026-09-08"
  },
  {
    id: "FMH-10244", customerName: "Sameer K.", phone: "9876501234",
    address: "Anna Nagar, Chennai", items: [{ id:"demo-2",productId:6,name:"Chicken Curry Cut",image:"",cut:"Curry Cut",weight:2,quantity:1,pricePerKg:260 }],
    subtotal:520, deliveryCharge:50, discount:50,total:520,paymentMethod:"UPI",deliveryMethod:"Home Delivery",status:"Confirmed",date:"2026-09-08"
  }
];