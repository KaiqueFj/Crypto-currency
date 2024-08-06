module.exports = function formatCurrency(value) {
  return parseFloat(value)
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
