/**
 * The Log In Page
 */

import App from '../lib/App';

const settingsTemplate = require('../templates/settings.hbs');

export default () => {
  // set the title of this page
  const title = 'Settings';

  // render the template
  App.render(settingsTemplate({ title }));


  const btnDeleteAccount = document.getElementById('btn-delete-account');
  const btnChangeUsername = document.getElementById('change-username');
  const btnChangePassword = document.getElementById('change-password');
  const btnBack = document.getElementById('btn-back');
  const usernameText = document.getElementById('change-username-btn-text');

  // const usernameHeading = document.getElementById('usernameHeading');

  // const usernameInput = document.getElementById('username');
  // const passwordInput = document.getElementById('password');

  App.onPageLoad(true);

  // Update custom heading
  usernameText.innerHTML = App.currentUser.username;

  // // add button functionality
  btnChangeUsername.addEventListener('click', () => {
    App.router.navigate('/settings/username');
  });

  btnChangePassword.addEventListener('click', () => {
    App.router.navigate('/settings/password');
  });

  btnBack.addEventListener('click', () => {
    // App.currentUser.username = usernameInput.value.trim() || App.currentUser.username;
    // App.currentUser.password = passwordInput.value || App.currentUser.password;

    // @TODO: validate
    App.router.navigate('/home');
  });

  btnDeleteAccount.addEventListener('click', () => {
    App.router.navigate('/account-warning');
  });
};
