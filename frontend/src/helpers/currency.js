const formatPrice = (price, currency) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency?.code || "INR",
  }).format(price);
};