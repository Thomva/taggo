/**
 * The Lobby Map Page
 */

import App from '../lib/App';
import Tools from '../lib/core/Tools';

import mapCard from '../templates/helpers/mapCard';

const lobbyMapTemplate = require('../templates/lobbyMap.hbs');

export default () => {
  // set the title of this page
  const title = 'Map';

  // render the template
  App.render(lobbyMapTemplate({ title }));


  const cardContainer = document.getElementById('card-container');

  const btnAll = document.getElementById('btn-all');


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
      App.lobby.mapFilter = map;

      App.router.navigate('/lobby');
    });
  }

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

  // add button functionality
  btnAll.addEventListener('click', () => {
    App.lobby.mapFilter = null;
    App.router.navigate('/lobby');
  });
};
