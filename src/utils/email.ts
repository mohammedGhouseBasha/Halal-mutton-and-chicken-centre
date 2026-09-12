import emailjs from "@emailjs/browser";
import { Order } from "../types";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// True only once real keys are filled in (see .env.example). Until then, order
// emails are skipped instead of crashing checkout.
export const isEmailConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

export const sendOrderNotificationEmail = (order: Order) => {
  if (!isEmailConfigured) return Promise.resolve();
  const items = order.items
    .map(i => `${i.weight >= 1 ? `${i.weight}kg` : `${Math.round(i.weight * 1000)}g`} ${i.name}${i.cut ? ` (${i.cut})` : ""} × ${i.quantity}`)
    .join("\n");
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, {
    order_id: order.id,
    customer_name: order.customerName,
    phone: order.phone,
    address: order.address,
    items,
    total: `₹${order.total.toLocaleString("en-IN")}`,
    payment_method: order.paymentMethod,
    delivery_method: order.deliveryMethod,
  }, { publicKey: PUBLIC_KEY });
};
