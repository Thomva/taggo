/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/**
 * A Game Object
 *
 * @author Thomas Van de Velde <thomvand26@student.arteveldehs.be>
 */

import Tools from './Tools';

export default class Game {
  /**
   * @param {gameDuration} - Duration of the game in milliseconds.
   */
  constructor(moderator, map, password = '', gameDuration = 300000, isPrivate = false, gameID, router, playersArray = null, status = -1, match = 0) {
    this._gameID = gameID;
    if (moderator.getNecessaryData) {
      this._moderator = moderator.getNecessaryData();
    } else {
      this._moderator = moderator;
    }
    this._duration = gameDuration;
    this._map = map;
    this._password = password;
    this._isPrivate = isPrivate;

    this._players = [this._moderator];
    if (playersArray) this._players.push(...playersArray);

    this._hunter = false;
    this._previousHunter = false;
    this._outsidePlayzoneInterval = null;
    this._match = match;

    this._status = status;

    this.router = router;
  }

  /**
   * @param {Map} map
   */
  set map(map) {
    this._map = map;
  }

  /**
   * @param {number} duration
   */
  set duration(duration) {
    this._duration = duration;
  }

  /**
   * @param {string} password
   */
  set password(password) {
    this._password = password;
  }

  set moderator(user) {
    this._moderator = user;
  }

  set status(gameState) {
    this._status = gameState;
    // this.onStatusChange();
  }

  set isPrivate(isPrivate) {
    this._isPrivate = isPrivate;
  }

  set hunter(userID) {
    this._hunter = userID;
  }

  set previousHunter(userID) {
    this._previousHunter = userID;
  }

  set match(number) {
    this._match = number;
  }

  set deleteGame(callback) {
    this._deleteGame = callback;
  }

  get gameID() {
    return this._gameID;
  }

  get map() {
    return this._map;
  }

  get moderator() {
    return this._moderator;
  }

  get duration() {
    return this._duration;
  }

  get password() {
    return this._password;
  }

  get durationLeft() {
    return this._durationLeft;
  }

  get allPlayers() {
    return this._players;
  }

  get isPrivate() {
    return this._isPrivate;
  }

  get status() {
    return this._status;
  }

  get playerAmount() {
    return this._players.length;
  }

  get GameState() {
    return {
      UNSTARTED: -1,
      ENDED: 0,
      PLAYING: 1,
      PAUSED: 2,
    };
  }

  get hunter() {
    return this._hunter;
  }

  get previousHunter() {
    return this._previousHunter;
  }

  get match() {
    return this._match;
  }

  getData() {
    return {
      gameID: this._gameID,
      moderator: this._moderator,
      duration: this._duration,
      mapID: this._map.id,
      password: this._password,
      isPrivate: this._isPrivate,
      players: this._players,
      status: this._status,
      hunter: this._hunter,
      previousHunter: this._previousHunter,
      match: this._match,
    };
  }

  setData(gameData, mapManager) {
    this._gameID = gameData.gameID;
    this._moderator = gameData.moderator;
    this._duration = gameData.duration;
    this._map = mapManager.getMap(gameData.mapID);
    this._password = gameData.password;
    this._isPrivate = gameData.isPrivate;
    this._players = gameData.players;
    this._status = gameData.status;
    this._hunter = gameData.hunter || false;
    this._previousHunter = gameData.previousHunter || false;
    this._match = gameData.match;
  }

  hasPlayer(user) {
    return this._players.filter(
      (userInArray) => (userInArray.userID === user.userID),
    )[0];
  }

  updatePlayer(user) {
    const userInArray = this.hasPlayer(user);
    if (userInArray) {
      this._players[this._players.indexOf(userInArray)] = user.getNecessaryData();
    }
  }

  onStatusChange() {
  }

  addPlayer(user, gameManager) {
    const userData = user.getNecessaryData();
    if (userData.userID) {
      if (!this.hasPlayer(user)) this._players.push(userData);
    }
    gameManager.setHasJoined(true);
  }

  kickPlayer(user) {
    const foundUser = this.hasPlayer(user);

    if (foundUser) {
      user.game = null;
      Tools.removeFromArray(foundUser, this._players);
      if (this._players.length > 0) {
        this._moderator = this._players[0];
      } else {
        this.destroyGame();
      }
    }
  }

  set updateTimer(callback) {
    this._updateTimer = callback;
  }

  finishGame() {
    clearInterval(this._durationInterval);
    this.status = 0;
    this.router.navigate('/game/finish');
  }

  setRandomHunter() {
    this._hunter = this._players[Math.floor(Math.random() * this._players.length)].userID;
  }

  startGame() {
    // Convert duration from minutes to mseconds
    this._timeLeft = this._duration;

    // Update interval in ms
    const timeUpdateInterval = 1000;

    this._durationInterval = setInterval(() => {
      // Percentage of time left
      const timePercentage = this._timeLeft / this._duration;

      if (this._updateTimer) this._updateTimer(timePercentage);
      if (this._timeLeft >= timeUpdateInterval) {
        this._timeLeft -= timeUpdateInterval;
      } else {
        this.finishGame();
      }
    }, timeUpdateInterval);
  }

  // If everyone leaves the game or the moderator stops the game
  destroyGame() {
    this._players.forEach((user) => {
      user.game = null;
    });
    if (this._deleteGame) {
      this._deleteGame(this);
    }
  }

  tag(currentUser, otherUser) {
    this.hunter = otherUser.userID;
    this.previousHunter = currentUser.userID;
    currentUser.gainPoints(40);
  }

  surviveBonus(currentUser) {
    currentUser.gainPoints(5);
  }

  clearOutsidePlayzoneInterval() {
    clearInterval(this.outsidePlayzoneInterval);
  }

  setIsInPlayzone(isInPlayzone, currentUser, save = null) {
    this._isInPlayzon = isInPlayzone;
    if (!isInPlayzone) {
      if (!this.outsidePlayzoneInterval) {
        this.outsidePlayzoneInterval = setInterval(() => {
          currentUser.losePoints(2);
          if (this.status !== 1) clearInterval(this.outsidePlayzoneInterval);
          if (save) save();
        }, 1000);
        if (save) save();
      }
    } else {
      clearInterval(this.outsidePlayzoneInterval);
      this.outsidePlayzoneInterval = null;
    }
    if (save) save();
  }
}
