/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/**
 * The Lobby Page
 */

import App from '../lib/App';
import Tools from '../lib/core/Tools';
import gameCard from '../templates/helpers/gameCard';

const lobbyTemplate = require('../templates/lobby.hbs');


export default () => {
  // set the title of this page
  const title = 'Home';
  // render the template

  App.render(lobbyTemplate({ title }));


  const cardContainer = document.getElementById('card-container');

  const btnDuration = document.getElementById('btn-duration');
  const btnMap = document.getElementById('btn-map');
  const btnPrivate = document.getElementById('btn-private');
  const btnBack = document.getElementById('btn-back');

  const { lobby } = App;
  const { durationFilter, mapFilter, privateFilter } = lobby;

  App.onPageLoad(true);

  function handleInvite() {
    const gameID = Tools.GETFromCurrrentUrl('gameID');
    const game = App.gameManager.getGame(gameID);
    if (gameID) {
      if (game) {
        if (game.isPrivate) {
          App.tryJoinGame(game);
        } else {
          App.joinGame(game);
        }
      } else {
        App.joinGame(game);
      }
    }
  }
  handleInvite();

  function updateFilterButtons() {
    if (durationFilter) {
      const durFrom = Tools.MSToMinutes(durationFilter.from) || null;
      const durTo = Tools.MSToMinutes(durationFilter.to) || null;
      btnDuration.innerHTML = `${durFrom} - ${durTo}`;
    } else {
      btnDuration.innerHTML = 'All';
    }

    btnMap.innerHTML = mapFilter ? mapFilter.name : 'All';
    btnPrivate.innerHTML = privateFilter !== null ? (privateFilter === 0 ? 'Private' : 'Public') : 'All';
  }
  updateFilterButtons();

  function updateGameCards() {
    cardContainer.innerHTML = '';
    // Load all joinable rooms
    const unstartedGames = App.allGames.filter((game) => game.status === -1);
    unstartedGames.forEach((game) => {
      if (
        (durationFilter ? durationFilter.from <= game.duration && game.duration <= durationFilter.to : true)
        && (mapFilter ? mapFilter === game.map : true)
        && (privateFilter !== null ? (privateFilter === 0 ? game.isPrivate : !game.isPrivate) : true)
      ) {
        const newNode = Tools.createElementFromString(
          gameCard(
            game.moderator.username || game.moderator._username,
            game.isPrivate,
            '',
            Tools.MSToMinutes(game.duration),
            game.map.name,
            game.playerAmount,
          ),
        );

        cardContainer.appendChild(newNode);

        // add button functionality
        newNode.addEventListener('click', () => {
          App.tryJoinGame(game);
        });
      }
    });

    if (unstartedGames.length < 1) {
      cardContainer.innerHTML = 'No games available';
      cardContainer.style.display = 'flex';
    } else {
      cardContainer.style.display = 'initial';
    }
  }
  updateGameCards();
  App.gameManager.updateLobby = updateGameCards;

  // add button functionality
  btnDuration.addEventListener('click', () => {
    App.router.navigate('/lobby/duration');
  });

  btnMap.addEventListener('click', () => {
    App.router.navigate('/lobby/map');
  });

  btnPrivate.addEventListener('click', () => {
    App.router.navigate('/lobby/private');
  });

  btnBack.addEventListener('click', () => {
    App.router.navigate('/home');
  });
};
