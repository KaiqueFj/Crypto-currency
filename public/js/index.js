const updateSpeedDoMeter = require('./fearGreed/fearGreed');
const { handleUserClicks } = require('./handleElements/handleClicks');
const {
  handleCoinsFunctions,
} = require('./handleCoinData/handleCoinsFunctions');
const {
  fearGreedValue,
  feedGreedCoinContainer,
  currencySelect,
  coinQuantity,
  select,
} = require('./handleElements/handleElements');
const {
  handleCoinValueInCurrency,
  insertFlags,
  updateValueOfCoinByQuantity,
} = require('./handleCoinData/handlePriceChange');
const { handleSortData } = require('./handleElements/handleSortValues');

const fearGreedNeedlePosition = fearGreedValue;

document.addEventListener('DOMContentLoaded', () => {
  handleCoinsFunctions();
  handleSortData();
  handleUserClicks();
});

// Handle the price change on coin page
if (select) {
  insertFlags();
}

if (currencySelect) {
  handleCoinValueInCurrency();
}

if (coinQuantity) {
  updateValueOfCoinByQuantity();
}

// Update speedometer
if (feedGreedCoinContainer) {
  if (fearGreedNeedlePosition && fearGreedValue !== null) {
    updateSpeedDoMeter(parseInt(fearGreedValue, 10));
  }
}
