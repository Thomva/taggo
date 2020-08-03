/**
 * The Game Unavailable Page
 */

import App from '../lib/App';

const gameUnavailableTemplate = require('../templates/gameUnavailable.hbs');

export default () => {
  // set the title of this page
  const title = 'Settings';

  // render the template
  App.render(gameUnavailableTemplate({ title }));


  const btnHome = document.getElementById('btn-home');

  const header = document.getElementById('message-header');

  App.onPageLoad(true);

  const message = App.TempStorage.getItem('gameUnavailableMsg');

  if (message) {
    // Update custom placeholder
    header.innerHTML = message;
    App.TempStorage.deleteItem('gameUnavailableMsg');
  } else {
    App.router.navigate('/home');
  }

  // add button functionality
  btnHome.addEventListener('click', () => {
    App.router.navigate('/home');
  });
};
