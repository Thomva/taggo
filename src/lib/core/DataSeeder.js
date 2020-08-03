/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/**
 * Dataseeder
 *
 * @author Thomas Van de Velde <thomvand26@student.arteveldehs.be>
 */

import Tools from './Tools';
import User from './User';

export default class DataSeeder {
  constructor(mapManager, gameManager, userManager) {
    this.gameManager = gameManager;
    this.mapManager = mapManager;
    this.userManager = userManager;
    this._allUsers = [];
    this.generateUsers(2);
  }

  generateUsers(amount) {
    for (let i = 0; i < amount; i++) {
      const newUser = new User(`user${i}`, `debugUser-${i}`);
      this.userManager.saveUser(newUser);
      this._allUsers.push(newUser);
    }
  }

  get allUsers() {
    return this._allUsers;
  }

  getRandomLocation(latlon, distance = 0.001) {
    if (latlon) {
      return {
        lat: parseFloat(latlon.lat) + Tools.randomFloat(-distance, distance),
        lon: parseFloat(latlon.lon) + Tools.randomFloat(-distance, distance),
      };
    }
    return null;
  }

  updateLocations(callback) {
    this.allUsers.forEach((user) => {
      if (user.location) {
        user.location = this.getRandomLocation(user.location, 0.0002);
      } else {
        user.location = this.getRandomLocation(user.game.map.getLonLat());
      }
      this.userManager.saveUser(user);
      if (callback) callback(user);
    });
  }

  startUpdatingLocations(callback) {
    if (this.allUsers[0].game) {
      const { mapBoxMap } = this.allUsers[0].game.map;
      if (mapBoxMap) {
        mapBoxMap.on('load', () => {
          mapBoxMap.on('click', (e) => {
            this.userManager.currentUser.location = {
              lat: e.lngLat.lat,
              lon: e.lngLat.lng,
            };
            this.userManager.saveCurrentUser();
            this.gameManager.currentGame.map.updateUserLocator(this.userManager.currentUser);
          });
        });
      }

      const locationsInterval = setInterval(() => {
        if (this.gameManager.currentGame.status === 0) clearInterval(locationsInterval);
        this.updateLocations(callback);
      }, 2000);
    }
  }
}
