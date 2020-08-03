/**
 * Map Manager
 *
 * @author Thomas Van de Velde <thomvand26@student.arteveldehs.be>
 */

import Map from './Map';
import Tools from './Tools';

// Compare 2 mapContainers (for sorting by closest map)
function compareClosest(mapContainerA, mapContainerB) {
  let comparison = 0;
  if (mapContainerA.distance > mapContainerB.distance) {
    comparison = 1;
  } else if (mapContainerA.distance < mapContainerB.distance) {
    comparison = -1;
  }
  return comparison;
}

export default class MapManager {
  constructor(mapStorage) {
    this.mapStorage = mapStorage;
    this._maps = [];
  }

  async loadMaps() {
    await this.mapStorage.getAllMaps((maps) => {
      this._maps = [];
      maps.forEach((map) => {
        this._maps.push(new Map(map.lon, map.lat, map.name, map.id));
      });
    });
  }

  getMap(mapID) {
    return this._maps.filter((map) => (map.id === mapID))[0];
  }

  get map() {
    return {
      campusMariakerke: this._maps[0],
      korenmarkt: this._maps[1],
    };
  }

  get allMaps() {
    return this._maps;
  }

  // Returns mapContainers (map + distance to user) of all maps, sorted by closest distance
  getAllMapsByClosest(userPostition) {
    const sortedMaps = [];

    this.allMaps.forEach((map) => {
      // Make a latlon object
      const userLatLon = {
        lat: userPostition.coords.latitude,
        lon: userPostition.coords.longitude,
      };

      // Calculate distance to the map
      const distanceToMap = Tools.latlonDistance(userLatLon, map.getLonLat());

      // Add the map and the distance to the map to a mapContainer object
      const mapContainer = {
        distance: distanceToMap,
        map,
      };

      // Add the mapContainer to the allMaps array
      sortedMaps.push(mapContainer);
    });

    // Sort all maps by closest to the user
    sortedMaps.sort(compareClosest);

    return sortedMaps;
  }
}
