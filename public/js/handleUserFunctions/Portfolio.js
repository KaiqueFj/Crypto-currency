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
