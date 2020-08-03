/**
 * The Home Page
 */

import App from '../lib/App';

const homeTemplate = require('../templates/home.hbs');

export default () => {
  // set the title of this page
  const title = 'Home';

  // render the template
  App.render(homeTemplate({ title }));


  const btnJoin = document.getElementById('btn-join');
  const btnCreate = document.getElementById('btn-create');
  const btnSettings = document.getElementById('btn-settings');
  const btnLogout = document.getElementById('btn-logout');

  const usernameHeading = document.getElementById('usernameHeading');


  const { currentUser } = App;

  // Update custom heading
  function setUserName(user) {
    usernameHeading.innerHTML = user ? user.username : 'Pending...';
  }
  setUserName(currentUser);

  App.onPageLoad(true, setUserName);

  // add button functionality
  btnJoin.addEventListener('click', () => {
    App.router.navigate('/lobby');
  });

  btnCreate.addEventListener('click', () => {
    App.createGame();
    App.router.navigate('/room');
  });

  btnSettings.addEventListener('click', () => {
    App.router.navigate('/settings');
  });

  btnLogout.addEventListener('click', () => {
    App.logout();
  });
};
