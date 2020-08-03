/**
 * Location Manager
 *
 * @author Thomas Van de Velde <thomvand26@student.arteveldehs.be>
 */

import { DEBUGGING } from '../../consts';

export default class LocationManager {
  getLocation(user = null) {
    return user ? user.location : null;
  }

  checkGeolocationPermission(onSuccess = null, onNoPermission = null) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (onSuccess) onSuccess(position);
      },
      () => {
        navigator.permissions.query({ name: 'geolocation' })
          .then((result) => {
            if (result.state === 'granted') {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  if (onSuccess) onSuccess(position);
                },
                () => {
                  if (onNoPermission) onNoPermission();
                },
              );
            } else if (result.state === 'prompt') {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  if (onSuccess) onSuccess(position);
                },
                () => {
                  if (onNoPermission) onNoPermission();
                },
              );
            } else if (result.state === 'denied') {
              if (onNoPermission) onNoPermission();
            }
          });
      },
    );
  }

  startAutoUpdateLocation(callback) {
    // Call a callback and save it to the storage everytime the location changes
    if (!DEBUGGING && navigator.geolocation) {
      this._watchID = navigator.geolocation.watchPosition((position) => {
        callback(position);
      }, (error) => {
        console.log(`navigator.geolocation Error: ${error}`);
      });
    }
  }

  stopAutoUpdateLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.clearWatch(this._watchID);
    }
  }
}
