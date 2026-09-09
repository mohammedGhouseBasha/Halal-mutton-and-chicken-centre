import { CartItem } from "../types";
export const WHATSAPP_NUMBER = "919876543210";
export const generateWhatsAppOrderMessage = (items: CartItem[], total: number) => {
  const lines = items.map(i => `${i.weight >= 1 ? `${i.weight}kg` : `${Math.round(i.weight*1000)}g`} ${i.name}${i.cut ? ` (${i.cut})` : ""}`);
  return `Hello Halal mutton and chicken centre, I would like to order:\n\n${lines.join("\n")}\n\nTotal: ₹${total.toLocaleString("en-IN")}\n\nPlease confirm my order.`;
};
export const openWhatsApp = (message: string) => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");