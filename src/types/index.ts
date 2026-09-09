export type Category = "Mutton" | "Chicken" | "Special Cuts" | "Offers";
export type OrderStatus = "Pending" | "Confirmed" | "Preparing" | "Ready" | "Out for Delivery" | "Delivered" | "Cancelled";

export interface Product {
  id: number;
  name: string;
  category: Category;
  pricePerKg: number;
  description: string;
  image: string;
  available: boolean;
  stockKg: number;
}

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  image: string;
  cut: string;
  weight: number;
  quantity: number;
  pricePerKg: number;
  instructions?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: string;
  deliveryMethod: string;
  status: OrderStatus;
  date: string;
  createdAt?: number;
}