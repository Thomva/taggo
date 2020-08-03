/**
 * The Register Username Page
 */

import App from '../lib/App';
import { DEBUGGING } from '../consts';

const registerUsernameTemplate = require('../templates/registerUsername.hbs');

export default () => {
  // set the title of this page
  const title = 'Create Account';

  // render the template
  App.render(registerUsernameTemplate({ title }));


  const btnLogin = document.getElementById('btn-login');
  const btnRegister = document.getElementById('btn-register');
  const btnBack = document.getElementById('btn-back');

  const usernameInput = document.getElementById('username');

  const usernameErrorField = usernameInput.nextSibling;

  function resetErrors() {
    usernameErrorField.innerHTML = '';
  }

  function showUsernameError(message) {
    usernameErrorField.innerHTML = message;
  }

  function createAccount() {
    App.createAccountFinalization(usernameInput.value, showUsernameError);
  }

  if (!DEBUGGING) {
    if (!App.firebase.getAuth().currentUser) App.router.navigate('/register');
    if (App.firebase.getAuth().currentUser && App.currentUser) App.router.navigate('/home');
  }

  // add button functionality
  btnRegister.addEventListener('click', () => {
    resetErrors();
    if (DEBUGGING) {
      App.router.navigate('/home');
    } else if (usernameInput.value) {
      createAccount();
    } else {
      showUsernameError('Please enter a username.');
    }
  });

  btnLogin.addEventListener('click', () => {
    App.router.navigate('/login');
  });

  btnBack.addEventListener('click', () => {
    App.deleteAccount();
  });

  usernameInput.addEventListener('input', () => {
    resetErrors();
  });
};
