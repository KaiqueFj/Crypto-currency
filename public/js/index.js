const updateSpeedDoMeter = require('./fearGreed/fearGreed');
import { signUp } from './handleUserFunctions/signUp';
import { signIn } from './handleUserFunctions/signIn';
import { updateSettings } from './handleUserFunctions/updateSettings';
import {
  addToPortfolio,
  deleteFromPortfolio,
} from './handleUserFunctions/Portfolio';
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
  updateUserForm,
  starSvgIcon,
  getCoinName,
  deleteIcon,
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

// Handle the add to portfolio
if (starSvgIcon) {
  const starSvgIcons = document.querySelectorAll('.starIcon');

  starSvgIcons.forEach((star) => {
    star.addEventListener('click', async (e) => {
      e.preventDefault();

      // Get the coin name from the data attribute
      const coinName = star.getAttribute('data-coin-name');

      try {
        const data = await addToPortfolio(coinName);
        console.log('Coin added to portfolio:', data);
      } catch (error) {
        console.error('Error adding to portfolio:', error);
      }
    });
  });
}

// Handle the delete from portfolio
if (deleteIcon) {
  deleteIcon.forEach((icon) => {
    icon.addEventListener('click', async (e) => {
      e.preventDefault();

      // Get the coin name from the data attribute
      const coinSlug = icon.getAttribute('data-coin-slug');

      try {
        const data = await deleteFromPortfolio(coinSlug);
        console.log('Coin deleted from portfolio:', data);
      } catch (error) {
        console.error('Error deleting from portfolio:', error);
      }
    });
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

// Handle the update user data
if (updateUserForm)
  updateUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'info');
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
