import axios from 'axios';
import { showAlert } from '../handleAlertPage/alert';

export const addToPortfolio = async (coinName) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/portfolio/addToPortfolio',
      data: {
        coins: [{ coinName }],
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Coin added to portfolio successfully!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteFromPortfolio = async (coinId) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/portfolio/deleteCoinFromPortfolio/${coinId}`,
      data: {},
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Coin deleted successfully!');

      // Reload the page after a short delay to allow the message to be seen
      setTimeout(() => {
        window.location.reload();
      }, 1);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
