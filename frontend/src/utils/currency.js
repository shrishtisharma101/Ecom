export const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

export const formatPriceINR = (price) => {
  const numericPrice = Number(String(price || "0").replace(/[^\d.]/g, ""));
  return formatINR(numericPrice);
};
