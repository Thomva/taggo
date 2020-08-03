/**
 * The Room Page
 */

import App from '../lib/App';
import { DEBUGGING, ROUTER_HASH } from '../consts';
// import Tools from '../lib/core/Tools';
// eslint-disable-next-line no-unused-vars

// import GameManager from '../lib/core/GameManager';

const roomInviteTemplate = require('../templates/roomInvite.hbs');

export default () => {
  // set the title of this page
  // const title = `${SITE_TITLE} is ready to go!`;
  const title = 'Invite';

  // render the template
  App.render(roomInviteTemplate({ title }));


  // const btnSendInvite = document.getElementById('btn-send-invite');
  const btnLink = document.getElementById('btn-copy-link');
  const btnBack = document.getElementById('btn-back');

  const roomLink = document.getElementById('room-link');

  const copyNotification = document.getElementById('copy-notification');

  App.onPageLoad(true);

  let { currentGame } = App;

  if (!currentGame) {
    console.log('no current game!');
    if (DEBUGGING) {
      App.createGame();
      App.addPseudoUsersToGame();
      currentGame = App.currentGame;
    } else {
      App.router.navigate('/home');
    }
  }

  // @TODO: '#!/' not included
  roomLink.innerHTML = `${window.location.origin}/${ROUTER_HASH}/lobby?gameID=${currentGame.gameID}`;

  // add button functionality
  // btnSendInvite.addEventListener('click', () => {
  //   // @TODO: send invite
  //   App.router.navigate('/room');
  // });

  btnLink.addEventListener('click', () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(roomLink.innerHTML);
      copyNotification.style.top = '0px';
      setTimeout(() => {
        copyNotification.style.top = '-40px';
      }, 2000);
    }
  });

  btnBack.addEventListener('click', () => {
    App.router.navigate('/room');
  });

  // Window listeners
  window.addEventListener('unload', () => {
    if (App.gameManager.currentGame) App.gameManager.leaveGame(App.userManager.currentUser);
  });
};
