/**
 * The Admin
 */

import App from '../lib/App';
import Map from '../lib/core/Map';

const adminTemplate = require('../templates/admin.hbs');

export default () => {
  // set the title of this page
  const title = 'Admin';

  // render the template
  App.render(adminTemplate({ title }));


  const btnAddMap = document.getElementById('btn-map-add');
  const btnAddGame = document.getElementById('btn-game-add');

  const mapLon = document.getElementById('map-lon');
  const mapLat = document.getElementById('map-lat');
  const mapName = document.getElementById('map-name');

  function saveMap() {
    const newMap = new Map(mapLon.value, mapLat.value, mapName.value);
    App.mapStorage.setMap(newMap.id, newMap.getData());
  }

  // add button functionality
  btnAddMap.addEventListener('click', () => {
    saveMap();
  });

  btnAddGame.addEventListener('click', () => {
    App.gameManager.createFakeGame(
      App.userManager.currentUser,
      App.mapManager.allMaps[0],
      '',
      6000,
      false,
      App.router,
    );
  });
};
