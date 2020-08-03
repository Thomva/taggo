/**
 * The Forgot Password Page
 */

import App from '../lib/App';
import { DEBUGGING } from '../consts';

const forgotPasswordTemplate = require('../templates/forgotPassword.hbs');

export default () => {
  // set the title of this page
  const title = 'Log in';

  // render the template
  App.render(forgotPasswordTemplate({ title }));


  const btnSendResetLink = document.getElementById('btn-send-reset-link');
  const btnBack = document.getElementById('btn-back');

  const emailInput = document.getElementById('email');

  const emailErrorField = emailInput.nextSibling;

  function resetErrors() {
    emailErrorField.innerHTML = '';
  }

  function showEmailError(message) {
    emailErrorField.innerHTML = message;
  }

  function resetPassword() {
    App.authentication.sendResetLink(emailInput.value, showEmailError, () => App.router.navigate('/login'));
  }

  // add button functionality
  btnSendResetLink.addEventListener('click', () => {
    resetErrors();
    if (!DEBUGGING) {
      if (emailInput.value) {
        resetPassword();
      } else {
        showEmailError(emailInput.value ? '' : 'Please enter your email address.');
      }
    }
  });

  btnBack.addEventListener('click', () => {
    App.router.navigate('/login');
  });

  emailInput.addEventListener('input', () => {
    resetErrors();
  });
};
