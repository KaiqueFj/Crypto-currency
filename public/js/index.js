const updateSpeedDoMeter = require('./fearGreed/fearGreed');
import { signUp } from './handleUserFunctions/signUp';
import { signIn } from './handleUserFunctions/signIn';
import { updateSettings } from './handleUserFunctions/updateSettings';
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
  updatePasswordForm,
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

// Handle the signUp
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

// Handle the signIn form
if (signInForm) {
  signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('.inputEmail').value;
    const password = document.querySelector('.inputPassword').value;

    signIn(email, password);
  });
}

// Handle the update user password
if (updatePasswordForm)
  updatePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { currentPassword, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
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
