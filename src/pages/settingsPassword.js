/**
 * The Log In Page
 */

import App from '../lib/App';
import { DEBUGGING } from '../consts';

const settingsPasswordTemplate = require('../templates/settingsPassword.hbs');

export default () => {
  // set the title of this page
  const title = 'Settings';

  // render the template
  App.render(settingsPasswordTemplate({ title }));


  const btnSendResetLink = document.getElementById('btn-send-reset-link');
  // const btnSave = document.getElementById('btn-save');
  const btnBack = document.getElementById('btn-back');

  const emailInput = document.getElementById('email');

  const emailErrorField = emailInput.nextSibling;

  function resetEmailError() {
    emailErrorField.innerHTML = '';
  }

  function showEmailError(message) {
    emailErrorField.innerHTML = message;
  }

  function resetPassword() {
    App.authentication.sendResetLink(emailInput.value, showEmailError, () => App.router.navigate('/login'));
  }

  App.onPageLoad(true);

  // add button functionality
  btnSendResetLink.addEventListener('click', () => {
    resetEmailError();
    if (DEBUGGING) {
      console.log('DEBUGGING');
    } else if (emailInput.value) {
      resetPassword();
    } else {
      showEmailError(emailInput.value ? '' : 'Please enter your email address.');
    }
  });

  btnBack.addEventListener('click', () => {
    App.router.navigate('/settings');
  });

  // btnSave.addEventListener('click', () => {
  //   // @TODO: authenticate (old)
  //   // @TODO: validate & save (new & confirm)
  //   App.router.navigate('/settings');
  // });

  emailInput.addEventListener('input', () => {
    resetEmailError();
  });
};
