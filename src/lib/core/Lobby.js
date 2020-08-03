/**
 * Lobby
 *
 * @author Thomas Van de Velde <thomvand26@student.arteveldehs.be>
 */

export default class Lobby {
  constructor() {
    this._duration = null;
    this._map = null;
    this._private = null;
    this._privateGame = null;
  }

  /**
   * @param {Object} amount
   * null = all
   * { from: amount1, to: amount2 }
   */
  set durationFilter(amount) {
    this._duration = amount;
  }

  /**
   * @param {Map} map
   * null = all
   */
  set mapFilter(map) {
    this._map = map;
  }

  /**
   * @param {Number} priv
   * 0 = Only Private
   * 1 = Only Public
   * null = all
   */
  set privateFilter(priv) {
    this._private = priv;
  }

  set privateGame(game) {
    this._privateGame = game;
  }

  get durationFilter() {
    return this._duration;
  }

  get mapFilter() {
    return this._map;
  }

  get privateFilter() {
    return this._private;
  }

  get privateGame() {
    return this._privateGame;
  }

  getFilters() {
    return {
      duration: this._duration,
      map: this._map,
      priv: this._private,
    };
  }
}
