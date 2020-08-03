/**
 * The Log In Page
 */

import App from '../lib/App';
import Tools from '../lib/core/Tools';
import { DEBUGGING, FIREBASE_API_KEY } from '../consts';

const loginTemplate = require('../templates/login.hbs');

export default () => {
  // set the title of this page
  const title = 'Log in';

  // render the template
  App.render(loginTemplate({ title }));

  App.onPageLoad(false);

  const btnLogin = document.getElementById('btn-login');
  const btnLoginGoogle = document.getElementById('btn-login-google');
  const btnRegister = document.getElementById('btn-register');
  const btnForgotPassword = document.getElementById('btn-forgot-password');

  const allInputs = document.querySelectorAll('input');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  const emailErrorField = emailInput.nextSibling;
  const passwordErrorField = passwordInput.nextSibling;

  function resetEmailError() {
    emailErrorField.innerHTML = '';
  }

  function resetPasswordError() {
    passwordErrorField.innerHTML = '';
  }

  function resetErrors() {
    resetEmailError();
    resetPasswordError();
  }

  function showEmailError(message) {
    emailErrorField.innerHTML = message;
  }

  function showPasswordError(message) {
    passwordErrorField.innerHTML = message;
  }

  // add button functionality
  btnLogin.addEventListener('click', () => {
    resetErrors();
    if (DEBUGGING) {
      App.router.navigate('/home');
    } else if (Tools.areAllInputsFilled(allInputs)) {
      App.loginWithEmail(
        emailInput.value,
        passwordInput.value,
        showEmailError,
        showPasswordError,
      );
    } else {
      showEmailError(emailInput.value ? '' : 'Please enter your email address.');
      showPasswordError(passwordInput.value ? '' : 'Please enter your password.');
    }
  });

  btnLoginGoogle.addEventListener('click', () => {
    App.loginWithGoogle();
  });

  btnRegister.addEventListener('click', () => {
    App.router.navigate('/register');
  });

  btnForgotPassword.addEventListener('click', () => {
    App.router.navigate('/forgot-password');
  });


  emailInput.addEventListener('input', () => {
    resetEmailError();
  });

  passwordInput.addEventListener('input', () => {
    resetPasswordError();
  });
};
