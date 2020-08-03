/**
 * The Log In Page
 */
import App from '../lib/App';

const settingsUsernameTemplate = require('../templates/settingsUsername.hbs');

export default () => {
  // set the title of this page
  const title = 'Settings';

  // render the template
  App.render(settingsUsernameTemplate({
    title,
  }));

  const btnSave = document.getElementById('btn-save');
  const btnBack = document.getElementById('btn-back');
  const usernameInput = document.getElementById('username');

  App.onPageLoad(true);

  // Update custom placeholder
  usernameInput.placeholder = App.currentUser.username;

  // add button functionality
  btnBack.addEventListener('click', () => {
    App.router.navigate('/settings');
  });

  btnSave.addEventListener('click', () => {
    // @TODO: validate & save
    App.currentUser.username = usernameInput.value || App.currentUser.username;
    App.userManager.saveCurrentUser();
    App.router.navigate('/settings');
  });
};