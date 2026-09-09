# Fresh Meat Hub

Production-style React + Vite + TypeScript prototype for a local Indian mutton & chicken shop.

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Included
- Customer storefront and responsive navigation
- Product search/filtering and product details
- Custom weight/cut/instructions
- LocalStorage cart persistence
- Checkout, Indian mobile validation, delivery/payment choices
- Local mock order creation and order tracking
- WhatsApp order helper
- Offers, About and Contact pages
- Admin dashboard
- Local product CRUD and availability
- Admin order status management
- Centralized product/order types and data
- Service-like LocalStorage persistence utilities

## API migration
The contexts and data utilities are intentionally separated from UI. Replace LocalStorage operations with REST service functions later:
GET/POST/PUT/DELETE `/api/products`
GET/POST/PATCH `/api/orders`
