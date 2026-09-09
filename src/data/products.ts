import { Product } from "../types";

const img = (q: string) => `https://images.unsplash.com/${q}?auto=format&fit=crop&w=900&q=85`;

export const initialProducts: Product[] = [
  { id: 1, name: "Mutton Curry Cut", category: "Mutton", pricePerKg: 850, description: "Fresh tender mutton prepared in curry-cut pieces.", image: img("photo-1603360946369-dc9bb6258143"), available: true, stockKg: 18 },
  { id: 2, name: "Mutton Biryani Cut", category: "Mutton", pricePerKg: 880, description: "Perfectly sized mutton pieces for rich biryani.", image: img("photo-1544025162-d76694265947"), available: true, stockKg: 12 },
  { id: 3, name: "Mutton Chops", category: "Mutton", pricePerKg: 950, description: "Meaty chops ideal for grilling, frying or roasting.", image: img("photo-1558030006-450675393462"), available: true, stockKg: 8 },
  { id: 4, name: "Mutton Keema", category: "Mutton", pricePerKg: 900, description: "Freshly minced mutton, prepared to order.", image: img("photo-1601050690597-df0568f70950"), available: true, stockKg: 10 },
  { id: 5, name: "Mutton Leg", category: "Mutton", pricePerKg: 1000, description: "Premium mutton leg for special family meals.", image: img("photo-1604908176997-125f25cc6f3d"), available: true, stockKg: 6 },
  { id: 6, name: "Chicken Curry Cut", category: "Chicken", pricePerKg: 260, description: "Fresh chicken cleaned and cut for everyday curries.", image: img("photo-1604503468506-a8da13d82791"), available: true, stockKg: 25 },
  { id: 7, name: "Chicken Biryani Cut", category: "Chicken", pricePerKg: 280, description: "Biryani-ready pieces with balanced bone and meat.", image: img("photo-1518492104633-130d0cc84637"), available: true, stockKg: 22 },
  { id: 8, name: "Chicken Breast", category: "Chicken", pricePerKg: 320, description: "Lean, boneless chicken breast for healthy meals.", image: img("photo-1604503468506-a8da13d82791"), available: true, stockKg: 15 },
  { id: 9, name: "Chicken Legs", category: "Chicken", pricePerKg: 300, description: "Juicy chicken legs prepared fresh.", image: img("photo-1588168333986-5078d3ae3976"), available: true, stockKg: 18 },
  { id: 10, name: "Chicken Wings", category: "Chicken", pricePerKg: 300, description: "Fresh wings, great for frying or grilling.", image: img("photo-1527477396000-e27163b481c2"), available: true, stockKg: 14 },
  { id: 11, name: "Chicken Lollipop", category: "Special Cuts", pricePerKg: 380, description: "Restaurant-style chicken lollipops, cleaned and shaped.", image: img("photo-1562967914-608f82629710"), available: true, stockKg: 9 },
  { id: 12, name: "Family Chicken Pack", category: "Offers", pricePerKg: 250, description: "A value-friendly chicken pack for family meals.", image: img("photo-1607623814075-e51df1bdc82f"), available: true, stockKg: 20 }
];