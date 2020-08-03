/**
 * User Storage
 *
 * @author Thomas Van de Velde <thomvand26@student.arteveldehs.be>
 */

import CloudStorage from './CloudStorage';

export default class UserStorage extends CloudStorage {
  async getUser(userID, onSuccess = null, onNotExist = null) {
    await this.getDocumentRT(
      'users',
      userID,
      onSuccess,
      onNotExist,
    );
  }

  setUser(userID, userData, onSuccess = null) {
    this.setDocumentRT(
      'users',
      userID,
      userData,
      onSuccess,
    );
  }

  removeUser(userID, onSuccess = null) {
    this.removeDocumentRT(
      'users',
      userID,
      onSuccess,
    );
  }
}
