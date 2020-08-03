/**
 * The Room Page
 */

import App from '../lib/App';
import Tools from '../lib/core/Tools';
import { DEBUGGING } from '../consts';

import userRoom from '../templates/helpers/roomUser';

import User from '../lib/core/User';

const roomTemplate = require('../templates/room.hbs');

export default () => {
  // set the title of this page
  const title = 'Room';

  // render the template
  App.render(roomTemplate({ title }));


  const switchButton = document.getElementById('btn-public-private');
  const switchCheckbox = document.getElementById('btn-public-private-checkbox');
  const btnGameDuration = document.getElementById('game-duration');
  const btnMap = document.getElementById('map');
  const btnInvite = document.getElementById('invite');
  const btnReady = document.getElementById('btn-ready');
  const btnLeave = document.getElementById('btn-leave');


  const checkboxPublicPrivate = document.querySelector('#btn-public-private > input');
  const passwordInput = document.getElementById('password');
  const passwordSetting = document.getElementById('password-setting');
  const allSettings = document.querySelectorAll('.m-gameSetting, .m-switchButton');

  const playerListDIV = document.getElementById('player-list');
  const moderatorDIV = document.getElementById('moderator');

  let isCurrentModerator;
  let isEnabledReadyBtn = true;
  const locationNeededMsg = 'Location permission is needed to play.';

  App.onPageLoad(true);

  if (App.currentUser) {
    App.currentUser.ready = false;
  } else {
    console.log('NO App.currentUser!');
    console.log('App.currentUser');
    console.log(App.currentUser);
    console.log('room info');
    console.log(App.currentGame);
    // console.log(App.currentUser);
  }

  function updateScreen() {
    isCurrentModerator = App.gameManager.currentGame.moderator.userID === App.currentUser.userID;

    // Update game duration value
    btnGameDuration.innerHTML = Tools.MSToMinutes(App.currentGame.duration);

    // Update map value
    btnMap.innerHTML = App.currentGame.map.name;
    console.log(App.currentGame);

    // Remove everything from the card
    playerListDIV.innerHTML = '';

    // Add a element for every user in this room
    App.currentGame.allPlayers.forEach((user) => {
      if (App.currentGame.moderator.userID === user.userID) {
        moderatorDIV.innerHTML = `${user.username}${user.userID === App.currentUser.userID ? ' (You)' : ''}`;
      } else {
        // Create a new node from the helper
        const newNode = Tools.createElementFromString(userRoom(user.username, (user.userID === App.currentUser.userID), (user.userID === App.currentGame.moderator.userID), '', `user-${user.username}`, user.ready));

        // Add the node to the card
        playerListDIV.appendChild(newNode);

        // add kick button functionality
        const kickButton = newNode.querySelector('.m-roomPlayers__kickButton');
        if (kickButton) {
          kickButton.addEventListener('click', () => {
            if (App.currentGame.allPlayers.includes(user)) {
              // Kick the player
              // Remove user from the game
              App.gameManager.kickPlayer(user);
              // Load data from the user into a new User() object
              App.userManager.getUserByID(user.userID, (loadedUser) => {
                const userObject = new User(loadedUser.username, loadedUser.userID);
                // Save User to RTDB
                App.userManager.saveUser(userObject);
                // Save the current game
                App.gameManager.saveCurrentGame();

                // Update the screen
                updateScreen();
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
  // updateScreen();

  function checkCurrentGame() {
    if (!App.gameManager.currentGame) {
      // REDIRECT TO HOME
      if (DEBUGGING) {
        App.createDebugGame();
      } else {
        // App.createGame(App.userManager.currentUser);
        App.router.navigate('/home');
      }
    }
  }

  function updatePasswordAccess() {
    if (App.currentGame.isPrivate && passwordSetting.classList.contains('m-gameSetting--disabled') && App.currentModerator.userID === App.currentUser.userID) {
      passwordSetting.classList.remove('m-gameSetting--disabled');
      passwordInput.disabled = false;
    } else if (!App.currentGame.isPrivate && !passwordSetting.classList.contains('m-gameSetting--disabled ')) {
      passwordSetting.classList.add('m-gameSetting--disabled');
      passwordInput.disabled = true;
    }
  }

  function updatePasswordInput() {
    passwordInput.value = App.currentGame.password || passwordInput.value;
  }

  function updatePublicPrivate() {
    switchCheckbox.checked = App.currentGame.isPrivate;
  }

  function updateSettingAccess() {
    isCurrentModerator = App.currentModerator.userID === App.currentUser.userID;

    allSettings.forEach((elment) => {
      if (isCurrentModerator && elment.classList.contains('m-gameSetting--disabled')) {
        elment.classList.remove('m-gameSetting--disabled');
      } else if (!isCurrentModerator && !elment.classList.contains('m-gameSetting--disabled')) {
        elment.classList.add('m-gameSetting--disabled');
      }
      updatePasswordAccess();
    });
  }

  function changePublicPrivate() {
    App.currentGame.isPrivate = checkboxPublicPrivate.checked;

    App.gameManager.saveCurrentGame();
    updatePasswordAccess();
  }

  function toggleReady() {
    App.currentUser.ready = !App.currentUser.ready;
    btnReady.innerHTML = App.currentUser.ready ? 'Not Ready' : 'Ready';
    btnReady.classList.remove(btnReady.classList.contains('a-button--tertiary') ? 'a-button--tertiary' : null);
    btnReady.classList.add(App.currentUser.ready ? 'a-button--tertiary' : null);
    console.log('reeadaid');
    console.log(App.currentUser);
    App.userManager.saveCurrentUser();
  }

  function disableReadyBtn(text) {
    isEnabledReadyBtn = false;
    btnReady.innerHTML = text;
    if (!btnReady.classList.contains('a-button--onlyText')) {
      btnReady.classList.add('a-button--onlyText');
    }
  }

  function enableReadyBtn() {
    isEnabledReadyBtn = true;
    if (btnReady.classList.contains('a-button-onlyText')) {
      btnReady.classList.remove('a-button--onlyText');
    }
  }

  function checkGeolocationPermission(onSuccess = null, onNoPermission = null) {
    App.locationManager.checkGeolocationPermission(
      (position) => {
        if (onSuccess) onSuccess(position);
        enableReadyBtn();
      },
      () => {
        if (onNoPermission) onNoPermission();
        disableReadyBtn(locationNeededMsg);
      },
    );
  }
  checkGeolocationPermission();

  function updateRoom() {
    checkCurrentGame();

    if (App.gameManager.currentGame) {
      updateScreen();
      updateSettingAccess();
      updatePasswordAccess();
      updatePasswordInput();
      updatePublicPrivate();
    }
  }
  updateRoom();
  App.gameManager.updateRoom = updateRoom;

  // add button functionality
  if (isCurrentModerator) {
    switchCheckbox.disabled = false;

    switchButton.addEventListener('change', () => {
      changePublicPrivate();
    });

    btnGameDuration.addEventListener('click', (e) => {
      e.preventDefault();
      App.router.navigate('/room/duration');
    });

    btnMap.addEventListener('click', () => {
      // console.log('map');
      App.router.navigate('/room/map');
    });

    // Or 'input' for instant changes
    passwordInput.addEventListener('change', () => {
      App.currentGame.password = passwordInput.value;
      App.gameManager.saveCurrentGame();
    });
  } else {
    switchCheckbox.disabled = true;
  }

  btnInvite.addEventListener('click', () => {
    App.router.navigate('/room/invite');
  });

  btnReady.addEventListener('click', () => {
    checkGeolocationPermission(
      (position) => {
        App.currentUser.location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        App.userManager.saveCurrentUser();
      },
      () => console.log('no permission: cant ready up'),
    );
    console.log(App.userManager.currentUser);
    if (isEnabledReadyBtn) {
      toggleReady();
    }
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
