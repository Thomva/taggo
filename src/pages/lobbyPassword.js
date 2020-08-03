/**
 * The Lobby Password Page
 */

import App from '../lib/App';

const lobbyPasswordTemplate = require('../templates/lobbyPassword.hbs');

export default () => {
  // set the title of this page
  const title = 'Settings';

  // render the template
  App.render(lobbyPasswordTemplate({ title }));


  const btnEnter = document.getElementById('btn-enter');
  const btnBack = document.getElementById('btn-back');
  const passwordInput = document.getElementById('room-password');

  const passwordErrorField = passwordInput.nextSibling;

  App.onPageLoad(true);

  function showPasswordError(message) {
    passwordErrorField.innerHTML = message;
  }

  // add button functionality
  btnBack.addEventListener('click', () => {
    App.router.navigate('/lobby');
  });

  btnEnter.addEventListener('click', () => {
    if (passwordInput.value === App.lobby.privateGame.password) {
      App.joinGame(App.lobby.privateGame);
      App.lobby.privateGame = null;
    } else {
      showPasswordError('The password is incorrect');
    }
  });
};
