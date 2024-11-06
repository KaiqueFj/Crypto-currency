import axios from 'axios';
import { showAlert } from '../handleAlertPage/alert';

export const signIn = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signIn',
      data: {
        email: email,
        password: password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully! ');
      window.setTimeout(() => {
        location.assign('/overview');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
