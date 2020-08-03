/**
 * The Room Page
 */

import App from '../lib/App';
import Tools from '../lib/core/Tools';
// eslint-disable-next-line no-unused-vars
import { DEBUGGING } from '../consts';

import mapCard from '../templates/helpers/mapCard';
// import GameManager from '../lib/core/GameManager';

const roomMapTemplate = require('../templates/roomMap.hbs');

export default () => {
  // set the title of this page
  // const title = `${SITE_TITLE} is ready to go!`;
  const title = 'Map';

  // render the template
  App.render(roomMapTemplate({ title }));


  const cardContainer = document.getElementById('card-container');

  if (!App.currentGame) {
    // App.createGame();
    if (DEBUGGING) {
      App.addPseudoUsersToGame();
    } else {
      App.router.navigate('/home');
    }
  }

  App.onPageLoad(true);

  // For rendering each map
  function renderMapCard(map, distance = null) {
    let distanceFormatted;
    if (distance) {
      distanceFormatted = (distance > 999 ? `${Tools.metersToKilometers(distance, 1)} km` : `${Math.round(distance)} m`);
    }

    const newNode = Tools.createElementFromString(mapCard(map.name, distance ? distanceFormatted : '', '', map.id));

    cardContainer.appendChild(newNode);

    // add button functionality
    newNode.addEventListener('click', () => {
      App.currentGame.map = map;
      App.gameManager.saveCurrentGame();

      App.router.navigate('/room');
    });
  }

  // @TODO: loading...
  // Check if Geolocation is granted
  App.locationManager.checkGeolocationPermission(
    (position) => {
      // All mapContainers
      const allMaps = App.mapManager.getAllMapsByClosest(position);

      // Render each map
      allMaps.forEach((mapContainer) => {
        renderMapCard(mapContainer.map, mapContainer.distance);
      });
    },
    () => {
      // No permission:
      // Render each map without distance to the map
      App.mapManager.allMaps.forEach((map) => {
        renderMapCard(map);
      });
    },
  );

  // Window listeners
  window.addEventListener('unload', () => {
    if (App.gameManager.currentGame) App.gameManager.leaveGame(App.userManager.currentUser);
  });
};
