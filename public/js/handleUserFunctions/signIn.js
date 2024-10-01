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

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/overview',
    });

    if ((res.data.status = 'success')) location.assign('/login');
  } catch (err) {
    showAlert('error', 'Error logging out! Try again');
  }
};
