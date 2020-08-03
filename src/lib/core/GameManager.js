/* eslint-disable no-param-reassign */
/* eslint-disable no-loop-func */
/**
 * Game Manager
 *
 * @author Thomas Van de Velde <thomvand26@student.arteveldehs.be>
 */

import Game from './Game';
import Tools from './Tools';
import {
  DEBUGGING,
  VIBRATE_ROLECHANGE,
  VIBRATE_GAME_START,
  VIBRATE_GAME_END,
} from '../../consts';
import {
  GAME_ALREADY_STARTED,
  GAME_NOT_EXIST,
  NOTIF_HUNTER,
  NOTIF_FREEMAN,
  NOTIF_GAME_START,
  NOTIF_GAME_END,
} from '../../strings';

export default class GameManager {
  constructor(
    gameStorage,
    mapManager,
    userManager,
    locationManager,
    router,
    tempStorage,
    notificationManager,
  ) {
    this._currentGame = null;
    this._games = [];
    this.gameStorage = gameStorage;
    this.mapManager = mapManager;
    this.userManager = userManager;
    this.locationManager = locationManager;
    this.router = router;
    this.tempStorage = tempStorage;
    this.notificationManager = notificationManager;

    this._hasJoined = false;

    this._updateInterval = null;

    this._hasStarted = false;

    this._isCurrentUserHunter = null;

    gameStorage.onLobbyChange((snapshot) => {
      this._games = [];
      snapshot.forEach((game) => {
        const gameData = game.val();
        if (gameData.gameID) {
          const newGame = new Game(
            gameData.moderator,
            this.mapManager.getMap(gameData.mapID),
            gameData.password,
            gameData.duration,
            gameData.isPrivate,
            gameData.gameID,
            this.router,
            gameData.players,
            gameData.status,
          );

          newGame.deleteGame = this.deleteGame.bind(this);
          this._games.push(newGame);
        }
      });
      if (this._updateLobby) this._updateLobby();
    });
  }

  loadGame(gameData) {
    const newGame = new Game(
      gameData.moderator,
      this.mapManager.getMap(gameData.mapID),
      gameData.password,
      gameData.duration,
      gameData.isPrivate,
      gameData.gameID,
      this.router,
      gameData.players,
      gameData.status,
    );
    newGame.deleteGame = this.deleteGame.bind(this);
    return newGame;
  }

  async loadGames() {
    await this.gameStorage.getAllGames((games) => {
      const goodGames = games.filter((game) => (game.gameID));
      this._games = [];
      goodGames.forEach((game) => {
        game.deleteGame = this.deleteGame.bind(this);
        this._games.push(
          this.loadGame(game),
        );
      });
      if (this._updateLobby) this._updateLobby();
    });
  }

  // Set the current game and get updates from that game from the DB
  set currentGame(game) {
    this._currentGame = game;
    if (game) {
      this.gameStorage.onGameChange(this._currentGame.gameID, (snapshot) => {
        if (snapshot) {
          this._currentGame.setData(snapshot, this.mapManager);
          this.onGameChange();
        }
      });
    } else {
      this._hasJoined = false;
    }
  }

  set updateLobby(callback) {
    this._updateLobby = callback;
  }

  set updateRoom(callback) {
    this._updateRoom = callback.bind(this);
  }

  set updateGameUI(callback) {
    this._updateGameUI = callback;
  }

  set updateScoreUI(callback) {
    this._updateScoreUI = callback;
  }

  set updateRoleUI(callback) {
    this._updateRoleUI = callback;
  }

  set updateCountdownUI(callback) {
    this._updateCountdownUI = callback;
  }

  set updateInGameRoom(callback) {
    this._updateInGameRoom = callback;
  }

  setHasJoined(hasJoined) {
    this._hasJoined = hasJoined;
  }

  get currentGame() {
    return this._currentGame;
  }

  get allGames() {
    // this.removeEmptyGames();
    return this._games;
  }

  addGame(game) {
    this.allGames.push(game);
  }

  async removeEmptyGames() {
    //
  }

  createGame(
    moderator,
    map,
    password,
    duration,
    isPrivate,
    router,
    isDebug = false,
    playersArray = null,
  ) {
    const newGame = new Game(
      moderator,
      map,
      password,
      duration,
      isPrivate,
      isDebug ? 'debug-gamematch=0' : `${Tools.getRandomHash()}match=0`,
      router,
      playersArray,
    );
    newGame.deleteGame = this.deleteGame.bind(this);
    this.currentGame = newGame;
    this.saveCurrentGame();
    this.addGame(newGame);
    return newGame;
  }

  createFakeGame(
    moderator,
    map,
    password,
    duration,
    isPrivate,
    router,
    isDebug = false,
    playersArray = null,
  ) {
    const newGame = new Game(
      moderator,
      map,
      password,
      duration,
      isPrivate,
      isDebug ? 'debug-gamematch=0' : `${Tools.getRandomHash()}match=0`,
      router,
      playersArray,
    );
    newGame.deleteGame = this.deleteGame.bind(this);
    this.saveGame(newGame);
    this.addGame(newGame);
    return newGame;
  }

  getGame(gameID) {
    const matchingGame = this._games.filter((game) => (game.gameID === gameID))[0];
    if (!matchingGame) {
      return null;
    }
    return matchingGame;
  }

  saveCurrentGame() {
    if (this._currentGame) {
      this.saveGame(this._currentGame);
    }
  }

  saveGame(game) {
    const gameData = game.getData();
    gameData.lastSave = Date.now();
    this.gameStorage.setGame(game.gameID, gameData);
  }

  startGame() {
    // Notify user
    this.notificationManager.notifyUser(
      NOTIF_GAME_START,
      VIBRATE_GAME_START,
      'startStop',
    );

    // Preload game
    this._currentGame.setRandomHunter();
    this._currentGame.router.navigate('/game');

    // Countdown
    let countdown = 4;
    const countdownInterval = setInterval(() => {
      if (countdown < 0) {
        if (this._updateCountdownUI) this._updateCountdownUI(countdown);
        clearInterval(countdownInterval);
        this._currentGame.startGame();
        if (!this._updateInterval) {
          this._updateInterval = setInterval(this.onUpdate.bind(this), 1000);
        }
        this._currentGame.status = 1;
        this.saveCurrentGame();
        this.checkIsHunter();
        this.userManager.currentUser.ready = false;
        this.userManager.saveCurrentUser();
        this._hasEnded = false;
      } else if (countdown > 0) {
        if (this._updateCountdownUI) this._updateCountdownUI(countdown);
      } else if (countdown === 0) {
        if (this._updateCountdownUI) this._updateCountdownUI('GO!');
      }
      countdown--;
    }, 1000);
  }

  deleteGame(game) {
    this.gameStorage.removeGame(game.gameID);
    Tools.removeFromArray(game, this._games);
  }

  kickPlayer(user) {
    const game = this.currentGame;
    this.currentGame.kickPlayer(user);
    if (game.allPlayers.length > 0) {
      this.saveCurrentGame();
    } else {
      this.removeEmptyGames();
    }
  }

  leaveGame(currentUser) {
    this.currentGame.clearOutsidePlayzoneInterval();

    this.gameStorage.stopOnGameChange(this._currentGame.gameID);
    this.kickPlayer(currentUser);
    currentUser.ready = false;
    currentUser.gameID = null;
    currentUser.score = 0;
    this.currentGame = null;
    this._hasJoined = false;
    this._hasStarted = false;
    this._hasEnded = false;
    this._isCurrentUserHunter = null;
    if (this._updateInterval) {
      clearInterval(this._updateInterval);
      this._updateInterval = null;
    }
    if (this._freemanInterval) {
      clearInterval(this._freemanInterval);
      this._freemanInterval = null;
    }

    // Stop watching position, otherwise cant getPosition for loading maps etc.
    this.locationManager.stopAutoUpdateLocation();

    // Save the user
    this.userManager.saveCurrentUser();
  }

  checkCollisions() {
    const { currentUser } = this.userManager;
    this._currentGame.allPlayers.forEach((otherUser) => {
      if (otherUser.userID !== currentUser.userID) {
        const collisionDistance = otherUser.tagRadius + currentUser.tagRadius;
        const playerDistance = Tools.latlonDistance(otherUser.location, currentUser.location);

        // Check if the current user collides with other players in the game
        if (playerDistance <= collisionDistance
        && this.currentGame.previousHunter !== otherUser.userID) {
          this._currentGame.tag(currentUser, otherUser);
          this.saveCurrentGame();
          setTimeout(() => {
            this._currentGame.previousHunter = false;
            this.saveCurrentGame();
          }, 5000);
        }
      }
    });
  }

  checkInPlayzone() {
    const { currentUser } = this.userManager;
    const currentMap = this.currentGame.map;
    const distance = Tools.latlonDistance(currentUser.location, currentMap.getLonLat());
    return (distance <= currentMap.playzoneRadius);
  }

  checkIsHunter() {
    const checkIsHunter = this.currentGame.hunter === this.userManager.currentUser.userID;

    // Only on role change:
    if (this._isCurrentUserHunter === null) {
      this._isCurrentUserHunter = (checkIsHunter);
      if (this._updateRoleUI) this._updateRoleUI(this._isCurrentUserHunter);
      this.notificationManager.notifyUser(
        checkIsHunter ? NOTIF_HUNTER : NOTIF_FREEMAN,
        VIBRATE_ROLECHANGE,
        'changeRole',
      );
    } else if (this._isCurrentUserHunter !== checkIsHunter) {
      this._isCurrentUserHunter = checkIsHunter;
      this.notificationManager.notifyUser(
        checkIsHunter ? NOTIF_HUNTER : NOTIF_FREEMAN,
        VIBRATE_ROLECHANGE,
        'changeRole',
      );
      if (this._updateRoleUI) this._updateRoleUI(this._isCurrentUserHunter);
    }

    // Start gaining survive bonuses
    if (checkIsHunter) {
      if (this._freemanInterval) {
        clearInterval(this._freemanInterval);
        this._freemanInterval = null;
      }
    } else if (!this._freemanInterval) {
      let secondsFreeman = 1;
      this._freemanInterval = setInterval(() => {
        if (secondsFreeman % 5 === 0) {
          this._currentGame.surviveBonus(this.userManager.currentUser);
          this.userManager.saveCurrentUser();
        }
        if (this.currentGame.status !== 1) {
          clearInterval(this._freemanInterval);
          this._freemanInterval = null;
        }
        secondsFreeman++;
      }, 1000);
    }
  }

  updateAllOtherLocators() {
    // Update locator for each player (not the currentUser)
    this._currentGame.allPlayers.forEach((user) => {
      if (user.location && user.userID !== this.userManager.currentUser.userID) {
        this._currentGame.map.updateUserLocator(
          user,
          (user.userID === this.currentGame.hunter),
        );
      }
    });
  }

  onUpdate() {
    if (!this._currentGame) {
      clearInterval(this._updateInterval);
      return;
    }
    this._currentGame.setIsInPlayzone(
      this.checkInPlayzone(),
      this.userManager.currentUser,
      () => {
        this.userManager.saveCurrentUser();
      },
    );
    if (this._updateScoreUI) this._updateScoreUI();

    if (this._currentGame.status !== 1) {
      if (this._updateInterval) {
        clearInterval(this._updateInterval);
        this._updateInterval = null;
      }
    }
  }

  checkLeftPlayers() {
  }

  onGameChange() {
    if (this._hasJoined) {
      if (this.userManager) {
        if (!this._currentGame.hasPlayer(this.userManager.currentUser)) {
          this.leaveGame(this.userManager.currentUser);
          this.router.navigate('/home');
        }
      }
    }
    if (this.currentGame) {
      switch (this.currentGame.status) {
        case -1:
          if (this._updateRoom) this._updateRoom();
          if (this._currentGame.allPlayers.every((user) => user.ready === true)) {
            if (!this._hasStarted) {
              this._hasStarted = true;
              this.startGame();
              if (!DEBUGGING) {
                this.locationManager.startAutoUpdateLocation((location) => {
                  this.userManager.currentUser.location = {
                    lat: location.coords.latitude,
                    lon: location.coords.longitude,
                  };
                  this.userManager.saveCurrentUser();
                  this._currentGame.map.updateUserLocator(this.userManager.currentUser);
                });
              }
            }
          }
          break;
        case 1:
          if (this._updateInGameRoom) this._updateInGameRoom();

          this.checkLeftPlayers();

          // Check id the current player is the hunter
          // + update the this._isCurrentUserHunter variable
          this.checkIsHunter();
          if (this._isCurrentUserHunter) {
            // check if my radius collides with the radius of other players
            this.checkCollisions();
          }

          this.updateAllOtherLocators();

          if (this._updateGameUI) this._updateGameUI();
          break;

        case 0:
          console.log('FINISHHHHHHHHHHHHH');
          if (!this._hasEnded) {
            // Notify user
            this.notificationManager.notifyUser(
              NOTIF_GAME_END,
              VIBRATE_GAME_END,
              'startStop',
            );
            this.currentGame.finishGame();

            // For doing the above only once.
            this._hasEnded = true;
          }
          break;

        default:
          break;
      }
    } else if (this._updateRoom) {
      // Probably left/kicked
      this._updateRoom();
    }
  }

  joinGame(game) {
    const user = this.userManager.currentUser;
    if (game) {
      if (game.status === -1) {
        this.currentGame = game;
        user.game = game;
        if (!game.hasPlayer(user)) {
          game.addPlayer(user, this);
        }
        this.userManager.saveCurrentUser();
        this.router.navigate('/room');
      } else {
        this.tempStorage.setItem('gameUnavailableMsg', GAME_ALREADY_STARTED);
        this.router.navigate('/game-unavailable');
      }
    } else {
      this.tempStorage.setItem('gameUnavailableMsg', GAME_NOT_EXIST);
      this.router.navigate('/game-unavailable');
    }
  }

  async replayGame() {
    const old = this.currentGame;
    const newMatch = old.match + 1;
    let baseGameID = old.gameID;
    baseGameID = baseGameID.replace(`match=${old.match}`, '');
    const newGameID = `${baseGameID}match=${newMatch}`;
    let newGame = null;

    // Leave the old game
    this.leaveGame(this.userManager.currentUser);

    // check if already restartd (new game_id in DB)
    await this.gameStorage.getGame(newGameID, (game) => {
      console.log('got game:');
      console.log(game);
      newGame = this.loadGame(game);
      this.joinGame(newGame);
    },
    () => {
      // make a new game based on the finished one
      console.log('replay - new game');
      newGame = new Game(
        this.userManager.currentUser,
        old.map,
        old.password,
        old.duration,
        old.isPrivate,
        newGameID,
        this.router,
        null,
        -1,
        newMatch,
      );

      newGame.deleteGame = this.deleteGame.bind(this);

      // set the players current game
      this.userManager.currentUser.game = newGame;

      // set current game to new game
      this.currentGame = newGame;
    });


    // save (new) current game and user
    this.userManager.saveCurrentUser();
    this.saveCurrentGame();
  }
}
