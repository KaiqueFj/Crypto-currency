import axios from 'axios';
import { showAlert } from '../handleAlertPage/alert';

export const signUp = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signUp',
      data: {
        name: name,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'created an account successfully! ');
      window.setTimeout(() => {
        location.assign('/signIn');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
