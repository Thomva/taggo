/**
 * Map Storage
 *
 * @author Thomas Van de Velde <thomvand26@student.arteveldehs.be>
 */

import CloudStorage from './CloudStorage';

export default class MapStorage extends CloudStorage {
  async getMap(mapID, onSuccess = null, onNotExist = null) {
    await this.getDocument(
      'maps',
      mapID,
      onSuccess,
      onNotExist,
    );
  }

  async getAllMaps(onSuccess = null, onError = null) {
    await this.getCollection(
      'maps',
      onSuccess,
      onError,
    );
  }

  setMap(mapID, mapData, onSuccess = null) {
    this.setDocument(
      'maps',
      mapID,
      mapData,
      onSuccess,
    );
  }

  removeMap(mapID, onSuccess = null) {
    this.removeDocument(
      'maps',
      mapID,
      onSuccess,
    );
  }
}
