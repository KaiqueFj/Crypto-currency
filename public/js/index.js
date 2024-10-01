const updateSpeedDoMeter = require('./fearGreed/fearGreed');
import { signUp } from './handleUserFunctions/signUp';
import { signIn } from './handleUserFunctions/signIn';
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
  signUpForm,
  signInForm,
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

if (signUpForm) {
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('.inputName').value;
    const email = document.querySelector('.inputEmail').value;
    const password = document.querySelector('.inputPassword').value;
    const passwordConfirm = document.querySelector(
      '.inputPasswordConfirm'
    ).value;

    signUp(name, email, password, passwordConfirm);
  });
}

if (signInForm) {
  signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('.inputEmail').value;
    const password = document.querySelector('.inputPassword').value;

    signIn(email, password);
  });
}

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
