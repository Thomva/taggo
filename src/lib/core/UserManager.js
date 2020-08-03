/**
 * User Manager
 *
 * @author Thomas Van de Velde <thomvand26@student.arteveldehs.be>
 */

import { DEBUGGING } from '../../consts';
import User from './User';

export default class UserManager {
  constructor(userStorage) {
    this.userStorage = userStorage;
    if (DEBUGGING) {
      this._currentUser = new User('debugger', 'debugger');
      this.saveCurrentUser();
    }
  }

  set currentUser(user) {
    this._currentUser = user;
  }

  set gameManager(gameManager) {
    this._gameManager = gameManager;
  }

  get currentUser() {
    return this._currentUser;
  }

  getUserByID(userID, onSuccess, onNotExist) {
    this.userStorage.getUser(userID, onSuccess, onNotExist);
  }

  createUser(username, userID) {
    if (DEBUGGING) {
      const newUser = new User(username, userID);
      const alreadyUser = this._currentUser;
      this._currentUser = this._currentUser || newUser;
      return alreadyUser ? newUser : this._currentUser;
    }
    const newUser = new User(username, userID);
    if (!DEBUGGING) {
      newUser.ready = false;
    }
    this._currentUser = newUser;
    this.saveCurrentUser();
    return this._currentUser;
  }

  saveUser(user) {
    this.userStorage.setUser(user.userID, user.getNecessaryData());
    if (user.game && this._gameManager) {
      user.game.updatePlayer(user);
      this._gameManager.saveCurrentGame();
    }
  }

  saveCurrentUser() {
    this.userStorage.setUser(this._currentUser.userID, this._currentUser.getNecessaryData(), () => {
      if (this._currentUser.game && this._gameManager) {
        this._currentUser.game.updatePlayer(this._currentUser);
        this._gameManager.saveCurrentGame();
      }
    });
  }
}
