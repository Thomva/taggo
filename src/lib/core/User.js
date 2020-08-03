/**
 * A User Object
 *
 * @author Thomas Van de Velde <thomvand26@student.arteveldehs.be>
 */

export default class User {
  constructor(username, userID, tagRadius = 10) {
    this._userID = userID;
    this._username = username;
    this._game = null;
    this._ready = false;
    this._status = 'online';

    this._location = null;
    this._score = 0;
    this._tagRadius = tagRadius;
  }

  set username(name) {
    this._username = name;
  }

  /**
   * @param {boolean} ready
   */
  set ready(ready) {
    this._ready = ready;
    if (this._game) {
      this._game.updatePlayer(this);
    }
  }

  /**
   * @param {Object} location
   * @param {Number} location.lat
   * @param {Number} location.lon
   */
  set location(location) {
    this._location = location;
  }

  /**
   * @param {Game} game
   */
  set game(game) {
    this._game = game;
  }

  set score(score) {
    this._score = score;
  }

  set tagRadius(radiusInMeters) {
    this._tagRadius = radiusInMeters;
  }

  get userID() {
    return this._userID;
  }

  get username() {
    return this._username;
  }

  get ready() {
    return this._ready;
  }

  get location() {
    return this._location;
  }

  get game() {
    return this._game;
  }

  get score() {
    return this._score;
  }

  get tagRadius() {
    return this._tagRadius;
  }

  getNecessaryData() {
    return {
      userID: this.userID,
      username: this.username,
      gameID: this.game ? this.game.gameID : null,
      ready: this.ready,
      location: this.location,
      score: this.score,
      status: this._status,
      tagRadius: this._tagRadius,
    };
  }

  gainPoints(amount) {
    this._score += amount;
  }

  losePoints(amount) {
    if (this._score - amount <= 0) {
      this._score = 0;
    } else {
      this._score -= amount;
    }
  }
}
