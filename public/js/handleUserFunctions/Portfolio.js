import axios from 'axios';
import { showAlert } from '../handleAlertPage/alert';

export const addToPortfolio = async (coinName) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/addToPortfolio',
      data: { coinName }, // Send the coinName directly
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Coin added to portfolio successfully!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
