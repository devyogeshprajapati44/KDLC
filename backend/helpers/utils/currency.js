const currencyMap = {
  India: {
    code: "INR",
    symbol: "₹"
  },
  USA: {
    code: "USD",
    symbol: "$"
  },
  UK: {
    code: "GBP",
    symbol: "£"
  },
  Canada: {
    code: "CAD",
    symbol: "CA$"
  },
  Australia: {
    code: "AUD",
    symbol: "A$"
  },
  Germany: {
    code: "EUR",
    symbol: "€"
  },
  France: {
    code: "EUR",
    symbol: "€"
  },
  UAE: {
    code: "AED",
    symbol: "د.إ"
  },
  Japan: {
    code: "JPY",
    symbol: "¥"
  },
  China: {
    code: "CNY",
    symbol: "¥"
  }
};


const getCurrencyByCountry = (country) => {
  return currencyMap[country] || {
    code: "INR",
    symbol: "₹"
  };
};


module.exports = {
  getCurrencyByCountry
};