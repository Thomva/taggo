/**
 * The Lobby Private Page
 */

import App from '../lib/App';

const lobbyPrivateTemplate = require('../templates/lobbyPrivate.hbs');

export default () => {
  // set the title of this page
  const title = 'Map';

  // render the template
  App.render(lobbyPrivateTemplate({ title }));


  const btnSave = document.getElementById('btn-save');

  const allRadios = document.querySelectorAll('.m-radioGroup__radio');

  App.onPageLoad(true);

  allRadios.forEach((radio) => {
    switch (true) {
      case Number.isNaN(parseInt(radio.value, 10)) && App.lobby.privateFilter === null:
        radio.setAttribute('checked', true);
        // console.log('NaNNN');
        break;
      case parseInt(radio.value, 10) === 0 && App.lobby.privateFilter === 0:
        radio.setAttribute('checked', true);
        break;
      case parseInt(radio.value, 10) === 1 && App.lobby.privateFilter === 1:
        radio.setAttribute('checked', true);
        break;

      default:
        break;
    }
  });

  // add button functionality
  btnSave.addEventListener('click', () => {
    const selectedRadio = document.querySelector('.m-radioGroup__radio:checked');
    const parsed = parseInt(selectedRadio.value, 10);
    App.lobby.privateFilter = Number.isNaN(parsed) ? null : parsed;

    // Get active radio
    App.router.navigate('/lobby');
  });
};
