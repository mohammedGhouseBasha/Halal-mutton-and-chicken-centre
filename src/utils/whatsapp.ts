import { CartItem, Order } from "../types";
export const WHATSAPP_NUMBER = "917868886520";
export const generateWhatsAppOrderMessage = (items: CartItem[], total: number) => {
  const lines = items.map(i => `${i.weight >= 1 ? `${i.weight}kg` : `${Math.round(i.weight*1000)}g`} ${i.name}${i.cut ? ` (${i.cut})` : ""}`);
  return `Hello Halal mutton and chicken centre, I would like to order:\n\n${lines.join("\n")}\n\nTotal: ₹${total.toLocaleString("en-IN")}\n\nPlease confirm my order.`;
};
export const generateOrderNotificationMessage = (order: Order) => {
  const lines = order.items.map(i => `${i.weight >= 1 ? `${i.weight}kg` : `${Math.round(i.weight*1000)}g`} ${i.name}${i.cut ? ` (${i.cut})` : ""} × ${i.quantity}`);
  return `🧾 New Order #${order.id}\n\nCustomer: ${order.customerName}\nPhone: ${order.phone}\nAddress: ${order.address}\n\nItems:\n${lines.join("\n")}\n\nTotal: ₹${order.total.toLocaleString("en-IN")}\nPayment: ${order.paymentMethod}\nDelivery: ${order.deliveryMethod}`;
};
export const openWhatsApp = (message: string) => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");