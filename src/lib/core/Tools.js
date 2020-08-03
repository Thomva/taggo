/**
 * Useful tools
 *
 * @author Tim De Paepe <tim.depaepe@arteveldehs.be>
 * @author Thomas Van de Velde <thomvand26@student.arteveldehs.be>
 * @author Philipe Fatio <https://github.com/fphilipe>
 * - metersToPixelsAtMaxZoom() from https://stackoverflow.com/questions/37599561/drawing-a-circle-with-the-radius-in-miles-meters-with-mapbox-gl-js
 * @author Chris Veness <ku.oc.epyt-elbavom@oeg-stpircs>
 * - Great-circle distance between 2 points (latitude and longitude) from http://www.movable-type.co.uk/scripts/latlong.html
 */

import { ROUTER_HASH } from '../../consts';

const crypto = require('crypto');

class Tools {
  static isUndefined(obj) {
    return typeof (obj) === 'undefined';
  }

  static areAllInputsFilled(inputList) {
    let allFilled = true;
    inputList.forEach((input) => {
      allFilled = input.value ? allFilled : false;
    });
    return allFilled;
  }

  static createElementFromString(string) {
    const tempDIV = document.createElement('div');
    tempDIV.innerHTML = string;
    return tempDIV.firstChild;
  }

  static removeFromArray(element, array) {
    if (array.indexOf(element) > -1) array.splice(array.indexOf(element), 1);
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static randomFloat(min, max) {
    return (Math.random() * (max - min)) + min;
  }

  static metersToPixelsAtMaxZoom(meters, latitude) {
    return meters / 0.075 / Math.cos((latitude * Math.PI) / 180);
  }

  static getRandomHash() {
    return (crypto.createHash('sha1').update(new Date().valueOf().toString() + Math.random().toString()).digest('base64')).replace(/\/|\\|\?|&|\+/g, '');
  }

  static minutesToMS(minutes) {
    return minutes * 60000;
  }

  static MSToMinutes(seconds) {
    return seconds / 60000;
  }

  static clamp(num, min, max) {
    let clampedNum = num >= max ? max : num;
    clampedNum = clampedNum <= min ? min : clampedNum;
    return clampedNum;
  }

  static GETFromCurrrentUrl(parameterName) {
    const urlString = (window.location.href).replace(`${ROUTER_HASH}/`, '');
    const url = new URL(urlString);
    return url.searchParams.get(parameterName);
  }

  static getRandomHexColor() {
    const chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
    const randomHex = ['#'];
    for (let i = 0; i < 6; i++) {
      randomHex.push(chars[Math.floor(Math.random() * chars.length)]);
    }
    return randomHex.join('');
  }

  // Returns distance in meters
  static latlonDistance(latlon1, latlon2) {
    if (!latlon1 || !latlon2) {
      return null;
    }

    const R = 6371e3;
    const latRadians1 = this.degreesToRadians(latlon1.lat);
    const latRadians2 = this.degreesToRadians(latlon2.lat);
    const distLat = this.degreesToRadians(latlon2.lat - latlon1.lat);
    const distLon = this.degreesToRadians(latlon2.lon - latlon1.lon);

    const a = Math.sin(distLat / 2) * Math.sin(distLat / 2)
      + Math.cos(latRadians1) * Math.cos(latRadians2)
      * Math.sin(distLon / 2) * Math.sin(distLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  }

  static degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  static metersToKilometers(meters, decimals = 0) {
    const km = meters / 1000;
    const multiplier = decimals === 0 ? 1 : 10 ** decimals;
    const rounded = Math.round(km * multiplier) / multiplier;
    return rounded;
  }
}

export default Tools;
