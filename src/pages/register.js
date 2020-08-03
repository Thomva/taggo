/**
 * The Register Page
 */

import App from '../lib/App';
import Tools from '../lib/core/Tools';
import { DEBUGGING } from '../consts';

const registerTemplate = require('../templates/register.hbs');

export default () => {
  // set the title of this page
  const title = 'Create Account';

  // render the template
  App.render(registerTemplate({ title }));

  App.onPageLoad(false);


  const btnLogin = document.getElementById('btn-login');
  const btnRegister = document.getElementById('btn-register');

  const allInputs = document.querySelectorAll('input');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const passwordConfirmInput = document.getElementById('password-confirm');

  const emailErrorField = emailInput.nextSibling;
  const passwordErrorField = passwordInput.nextSibling;
  const passwordConfirmErrorField = passwordConfirmInput.nextSibling;


  function resetEmailError() {
    emailErrorField.innerHTML = '';
  }

  function resetPasswordError() {
    passwordErrorField.innerHTML = '';
  }

  function resetPasswordConfirmError() {
    passwordConfirmErrorField.innerHTML = '';
  }

  function resetErrors() {
    resetEmailError();
    resetPasswordError();
    resetPasswordConfirmError();
  }

  function showEmailError(message) {
    emailErrorField.innerHTML = message;
  }

  function showPasswordError(message) {
    passwordErrorField.innerHTML = message;
  }

  function showPasswordConfirmError(message) {
    passwordConfirmErrorField.innerHTML = message;
  }

  function createAccount() {
    App.createAccount(
      emailInput.value,
      passwordInput.value,
      showEmailError,
      showPasswordError,
    );
  }

  // add button functionality
  btnRegister.addEventListener('click', () => {
    resetErrors();
    if (DEBUGGING) {
      App.router.navigate('/register/username');
    } else if (Tools.areAllInputsFilled(allInputs)) {
      if (passwordInput.value === passwordConfirmInput.value) {
        createAccount();
      } else {
        showPasswordConfirmError('The passwords must match.');
      }
    } else {
      showEmailError(emailInput.value ? '' : 'Please enter your email address.');
      showPasswordError(passwordInput.value ? '' : 'Please enter a password.');
      showPasswordConfirmError(passwordConfirmInput.value ? '' : 'Please confirm your password.');
    }
  });

  btnLogin.addEventListener('click', () => {
    App.router.navigate('/login');
  });

  emailInput.addEventListener('input', () => {
    resetEmailError();
  });

  passwordInput.addEventListener('input', () => {
    resetPasswordError();
  });

  passwordConfirmInput.addEventListener('input', () => {
    resetPasswordConfirmError();
  });
};
