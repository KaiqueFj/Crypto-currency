const updateSpeedDoMeter = require("./fearGreed");
const { handleUserClicks } = require("./handleClicks");
const { handleCoinsFunctions } = require("./handleCoinsFunctions");
const { handleSortData } = require("./HandleSortValues");

document.addEventListener("DOMContentLoaded", () => {
  handleCoinsFunctions();
  handleSortData();
  handleUserClicks();

  // Update speedometer
  const fearGreedValue =
    document.querySelector(".fear-greed-value").dataset.value;

  if (fearGreedValue) {
    updateSpeedDoMeter(parseInt(fearGreedValue, 10));
  }
});
