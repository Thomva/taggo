/**
 * Game Storage
 *
 * @author Thomas Van de Velde <thomvand26@student.arteveldehs.be>
 */

import CloudStorage from './CloudStorage';

export default class GameStorage extends CloudStorage {
  async getGame(gameID, onSuccess = null, onNotExist = null) {
    await this.getDocumentRT(
      'games',
      gameID,
      onSuccess,
      onNotExist,
    );
  }

  async getAllGames(onSuccess = null, onError = null) {
    await this.getCollectionRT(
      'games',
      onSuccess,
      onError,
    );
  }

  setGame(gameID, gameData, onSuccess = null) {
    this.setDocumentRT(
      'games',
      gameID,
      gameData,
      onSuccess,
    );
  }

  onLobbyChange(onChange) {
    this.onCollectionChangeRT('games', onChange);
  }

  onGameChange(gameID, onChange) {
    this.onDocumentChangeRT('games', gameID, onChange);
  }

  stopOnGameChange(gameID) {
    this.stopOnDocumentChangeRT('games', gameID);
  }

  removeGame(gameID, onSuccess = null) {
    this.removeDocumentRT(
      'games',
      gameID,
      onSuccess,
    );
  }
}
