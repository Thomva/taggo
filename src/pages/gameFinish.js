/**
 * The Game Finish Page
 */

import App from '../lib/App';
import Tools from '../lib/core/Tools';
import winnerElement from '../templates/helpers/winnerElement';

const gameFinishTemplate = require('../templates/gameFinish.hbs');

export default () => {
  const { currentGame } = App;
  if (!currentGame) {
    App.router.navigate('/home');
  } else if (currentGame.status !== currentGame.GameState.ENDED) {
    currentGame.finishGame();
  }

  // set the title of this page
  const title = 'Finish';

  // render the template
  App.render(gameFinishTemplate({ title }));

  const btnPlayAgain = document.getElementById('btn-play-again');
  const btnLeave = document.getElementById('btn-leave');

  const winnerSpan = document.getElementById('winner-name');
  const winnersDIV = document.getElementById('winners-container');


  // Make a copy of allPlayers array (to sort)
  const sortedUsers = App.currentGame.allPlayers.slice();

  function renderWinnerElement(user) {
    const place = sortedUsers.indexOf(user) + 1;
    const newNode = Tools.createElementFromString(winnerElement(
      place,
      user.username,
      user.score,
      user === App.currentUser,
      user.userID,
    ));

    winnersDIV.appendChild(newNode);

    winnerSpan.innerHTML = place === 1 ? user.username : winnerSpan.innerHTML;
  }

  function compareScores(userA, userB) {
    let comparison = 0;
    if (userA.score < userB.score) {
      comparison = 1;
    } else if (userA.score > userB.score) {
      comparison = -1;
    }
    return comparison;
  }


  // Sort the array by highest score
  sortedUsers.sort(compareScores);

  // Render each winnerElement
  sortedUsers.forEach((user) => {
    renderWinnerElement(user);
  });

  // add button functionality
  btnPlayAgain.addEventListener('click', () => {
    App.gameManager.replayGame();
    App.router.navigate('/room');
  });

  btnLeave.addEventListener('click', () => {
    App.gameManager.leaveGame(App.userManager.currentUser);
    App.router.navigate('/home');
  });

  // Window listeners
  window.addEventListener('unload', () => {
    if (App.gameManager.currentGame) App.gameManager.leaveGame(App.userManager.currentUser);
  });
};
