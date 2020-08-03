/* eslint-disable no-param-reassign */
/**
 * The In Game Page
 */

import App from '../lib/App';
import { MAPBOX_API_KEY, DEBUGGING } from '../consts';
import MapBox from '../lib/core/MapBox';

import userRoom from '../templates/helpers/roomUser';
import Tools from '../lib/core/Tools';
import User from '../lib/core/User';

const gameTemplate = require('../templates/game.hbs');

export default () => {
  // set the title of this page
  const title = 'In Game';

  // render the template
  App.render(gameTemplate({ title }));


  const btnSettings = document.getElementById('btn-settings');
  const btnLeaveGame = document.getElementById('btn-leave-game');
  const btnEndGame = document.getElementById('btn-end-game');

  const barTime = document.getElementById('bar-time');
  const barTimeLeft = document.getElementById('bar-time-left');
  const clockDIV = document.getElementById('clock');

  const scoreSpan = document.getElementById('score');
  const gameHeader = document.getElementById('game-header');
  const role = document.getElementById('role');
  const countdownContainer = document.getElementById('countdown');

  const inGameSettingsDIV = document.getElementById('in-game-settings');
  const playerListDIV = document.getElementById('player-list');
  const moderatorDIV = document.getElementById('moderator');
  let isCurrentModerator;

  let areSettingsShown = false;

  if (!App.currentGame) {
    if (DEBUGGING) {
      App.createDebugGame();
    } else {
      App.router.navigate('/home');
    }
  }

  // create the MapBox options
  const mapBoxOptions = {
    container: 'game-map',
    center: [App.currentMap.lon, App.currentMap.lat],
    style: 'mapbox://styles/thomvand26/ck3yj4kgn0a3o1co8dhvujip4?optimize=true',
    zoom: 16,
    minZoom: 14,
    maxZoom: 17,
  };

  function updateTimer(timeLeftPercentage) {
    const totalWidth = barTime.offsetWidth;
    barTimeLeft.style.width = `${timeLeftPercentage * totalWidth}px`;
    clockDIV.style.transform = `rotate(${(360 * (1 - timeLeftPercentage))}deg)`;
  }
  App.currentGame.updateTimer = updateTimer;

  function startDataseder() {
    if (DEBUGGING) App.dataSeeder.startUpdatingLocations();
  }

  // create a new MapBox instance
  // NOTE: make sure the HTML is rendered before making an instance of MapBox
  // (it needs an element to render)
  if (MAPBOX_API_KEY !== '') {
    const mapBox = new MapBox(MAPBOX_API_KEY, mapBoxOptions);
    App.currentMap.loadPlayZone(mapBox.getMap());
    App.currentGame.allPlayers.forEach((player) => {
      App.addUserLocator(player);
      if (DEBUGGING) {
        player.location = App.currentMap.getLonLat();
      }

      startDataseder();
    });
  }

  function changeRole(isHunter) {
    if (isHunter) {
      role.innerHTML = 'Hunter';
      if (!gameHeader.classList.contains('o-gameHeader--hunter')) {
        gameHeader.classList.add('o-gameHeader--hunter');
      }
    } else {
      role.innerHTML = 'Freeman';
      if (gameHeader.classList.contains('o-gameHeader--hunter')) {
        gameHeader.classList.remove('o-gameHeader--hunter');
      }
    }
  }

  function updateGameUI() {
  }
  App.gameManager.updateGameUI = updateGameUI;
  App.gameManager.updateRoleUI = changeRole;

  function updateScoreUI() {
    scoreSpan.innerHTML = App.currentUser.score;
  }
  App.gameManager.updateScoreUI = updateScoreUI;

  function updateCountdownUI(countDownText) {
    if (countDownText === -1) {
      countdownContainer.classList.add('a-overlayText--hide');
      return;
    }
    countdownContainer.innerHTML = countDownText;
  }
  App.gameManager.updateCountdownUI = updateCountdownUI;

  function updateInGameSettings() {
    isCurrentModerator = App.gameManager.currentGame.moderator.userID === App.currentUser.userID;

    // Remove everything from the card
    playerListDIV.innerHTML = '';

    if (isCurrentModerator) {
      btnEndGame.style.display = 'flex';
    } else {
      btnEndGame.style.display = 'none';
    }

    // Add a element for every user in this room
    App.currentGame.allPlayers.forEach((user) => {
      if (App.currentGame.moderator.userID === user.userID) {
        moderatorDIV.innerHTML = `${user.username}${user.userID === App.currentUser.userID ? ' (You)' : ''}`;
      } else {
        // Create a new node from the helper
        const newNode = Tools.createElementFromString(userRoom(user.username, (user.userID === App.currentUser.userID), (user.userID === App.currentGame.moderator.userID), '', `user-${user.username}`, false));

        // Add the node to the card
        playerListDIV.appendChild(newNode);

        // add kick button functionality
        const kickButton = newNode.querySelector('.m-roomPlayers__kickButton');
        if (kickButton) {
          kickButton.addEventListener('click', () => {
            if (App.currentGame.hasPlayer(user)) {
              // Kick the player
              App.gameManager.kickPlayer(user);
              // Load data from the user into a new User() object
              App.userManager.getUserByID(user.userID, (loadedUser) => {
                const userObject = new User(loadedUser.username, loadedUser.userID);
                // Save User to RTDB
                App.userManager.saveUser(userObject);
                // Save the current game
                App.gameManager.saveCurrentGame();

                // Update the in-game settings
                updateInGameSettings();
              });
            }
          });

          // Remove the kick buttons if the current player is not the moderator
          if (App.currentModerator.userID !== App.currentUser.userID) {
            kickButton.remove();
          }
        }
      }
    });
  }
  updateInGameSettings();
  App.gameManager.updateInGameRoom = updateInGameSettings;

  function toggleInGameSettingsMenu() {
    if (!areSettingsShown) {
      inGameSettingsDIV.style.display = 'flex';
    } else {
      inGameSettingsDIV.style.display = 'none';
    }
    areSettingsShown = !areSettingsShown;
  }

  // add button functionality
  btnSettings.addEventListener('click', () => {
    toggleInGameSettingsMenu();
  });

  btnEndGame.addEventListener('click', () => {
    App.gameManager.currentGame.finishGame();
    App.gameManager.saveCurrentGame();
  });

  btnLeaveGame.addEventListener('click', () => {
    App.gameManager.leaveGame(App.userManager.currentUser);
    App.router.navigate('/home');
  });

  // Window listeners
  window.addEventListener('unload', () => {
    if (App.gameManager.currentGame) App.gameManager.leaveGame(App.userManager.currentUser);
  });
};
