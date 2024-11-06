import axios from 'axios';
import { showAlert } from '../handleAlertPage/alert';

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if ((res.data.status = 'success')) location.assign('/');
  } catch (err) {
    showAlert('error', 'Error logging out! Try again');
  }
};
