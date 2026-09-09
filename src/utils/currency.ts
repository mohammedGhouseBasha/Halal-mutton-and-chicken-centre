export const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
export const calcPrice = (pricePerKg: number, weightKg: number) => pricePerKg * weightKg;