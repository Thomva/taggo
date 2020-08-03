/**
 * A Map Object
 *
 * @author Thomas Van de Velde <thomvand26@student.arteveldehs.be>
 */

import Tools from './Tools';
import { COLOR_PRIMARY, COLOR_FREEMAN, COLOR_HUNTER } from '../../consts';

export default class Map {
  constructor(lon, lat, name, mapID = null, dataSeeder) {
    this._id = mapID || `${name}-${Tools.randomInt(10000, 99999)}`;
    this._lon = lon;
    this._lat = lat;
    this._name = name;

    this._mapBoxMap = null;

    this._users = [];

    this._playzoneRadius = 170;

    this.dataSeeder = dataSeeder;
  }

  setLonLat(lon, lat) {
    this._lon = lon;
    this._lat = lat;
  }

  getLonLat() {
    return { lon: this._lon, lat: this._lat };
  }

  get id() {
    return this._id;
  }

  get lon() {
    return this._lon;
  }

  get lat() {
    return this._lat;
  }

  get name() {
    return this._name;
  }

  get mapBoxMap() {
    return this._mapBoxMap;
  }

  get playzoneRadius() {
    return this._playzoneRadius;
  }

  getData() {
    return {
      id: this.id,
      lon: this.lon,
      lat: this.lat,
      name: this.name,
    };
  }

  // @TODO: move to MapManager?
  // Draw a Radius
  drawNewRadius({ lat, lon }, _id, radiusInMeters, color) {
    // Draw a new geojson circle

    this._mapBoxMap.on('load', () => {
      this._mapBoxMap.addSource(_id, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
          }],
        },
      });

      // Add the circle to the map (layer)
      this._mapBoxMap.addLayer({
        id: _id.toString(),
        type: 'circle',
        source: _id,
        paint: {
          'circle-radius': {
            stops: [
              [0, 0],
              [20, Tools.metersToPixelsAtMaxZoom(radiusInMeters, lat)],
            ],
            base: 2,
          },
          'circle-color': color,
          'circle-opacity': 0.5,
        },
      });
    });
  }

  updateRadius(latlon, _id, color) {
    let position;
    if (typeof latlon.lat !== 'number') {
      position.lat = parseFloat(latlon.lat);
      position.lon = parseFloat(latlon.lon);
    } else {
      position = latlon;
    }
    if (this._mapBoxMap) {
      if (this._mapBoxMap.getSource(_id)) {
        this._mapBoxMap.getSource(_id).setData({
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [position.lon, position.lat],
            },
          }],
        });
      }
      if (this._mapBoxMap.getLayer(_id)) {
        this._mapBoxMap.setPaintProperty(_id, 'circle-color', color);
      }
    }
  }

  addUserLocator(user) {
    if (typeof this._lon !== 'number') {
      this._lat = parseFloat(this._lat);
      this._lon = parseFloat(this._lon);
    }

    const randomID = Tools.randomInt(0, 10000).toString();
    this._users.push({ id: randomID, user });
    this.drawNewRadius(
      { lon: this._lon, lat: this._lat },
      randomID,
      10,
      COLOR_PRIMARY,
    );
  }

  updateUserLocator(user, isHunter = null) {
    let id;
    // @TODO: Better with .filter((userContainer) => userContainer.user === user)[0]
    this._users.forEach((userContainer) => {
      if (userContainer.user.userID === user.userID) id = userContainer.id;
    });

    if (user.location) {
      if (isHunter === null) {
        this.updateRadius(user.location, id, COLOR_PRIMARY);
      } else {
        this.updateRadius(user.location, id, isHunter ? COLOR_HUNTER : COLOR_FREEMAN);
      }
    }
  }

  loadPlayZone(mapBoxMap) {
    this._mapBoxMap = mapBoxMap;
    this.drawNewRadius({ lon: this._lon, lat: this._lat }, 'playZone', this._playzoneRadius, COLOR_PRIMARY);
  }
}
