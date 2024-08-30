const updateSpeedDoMeter = require("./fearGreed");
const { handleUserClicks } = require("./handleClicks");
const { handleCoinsFunctions } = require("./handleCoinsFunctions");
const { fearGreedValue } = require("./handleElements");
const {
  handleCoinValueInCurrency,
  insertFlags,
  updateValueOfCoinByQuantity,
} = require("./handlePriceChange");
const { handleSortData } = require("./HandleSortValues");

const fearGreedNeedlePosition = fearGreedValue;

document.addEventListener("DOMContentLoaded", () => {
  handleCoinsFunctions();
  handleSortData();
  handleCoinValueInCurrency();
  insertFlags();
  updateValueOfCoinByQuantity();
  handleUserClicks();
});

// Update speedometer

if (fearGreedNeedlePosition) {
  updateSpeedDoMeter(parseInt(fearGreedValue, 10));
}
