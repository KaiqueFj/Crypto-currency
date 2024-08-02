const { handleCoinsFunctions } = require("./handleCoinsFunctions");
const { handleSortData } = require("./sortValues");

document.addEventListener("DOMContentLoaded", () => {
  handleCoinsFunctions();
  handleSortData();
});
