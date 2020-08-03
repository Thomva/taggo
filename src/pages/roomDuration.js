/**
 * The Room Page
 */

import App from '../lib/App';
import Tools from '../lib/core/Tools';
// eslint-disable-next-line no-unused-vars
import { DEBUGGING } from '../consts';

// import userRoom from '../templates/helpers/roomUser';
// import GameManager from '../lib/core/GameManager';

const roomDurationTemplate = require('../templates/roomDuration.hbs');

export default () => {
  // set the title of this page
  // const title = `${SITE_TITLE} is ready to go!`;
  const title = 'Game Duration';

  // render the template
  App.render(roomDurationTemplate({ title }));


  const btnSave = document.getElementById('btn-save');
  const durationInput = document.getElementById('duration-input');
  const durationSpan = document.getElementById('duration-span');
  const customFullTrack = document.getElementById('full-track');
  const customFilledTrack = document.getElementById('filled-track');
  const customHandleFirst = document.getElementById('handle-first');

  App.onPageLoad(true);

  if (!App.currentGame) {
    // App.createGame();
    if (DEBUGGING) {
      App.addPseudoUsersToGame();
    } else {
      App.router.navigate('/home');
    }
  }

  const currentDurationInMinutes = Tools.MSToMinutes(App.currentGame.duration);


  function updateCustomSlider(valuePercentage) {
    const filledWidth = valuePercentage * customFullTrack.offsetWidth;
    customFilledTrack.style.width = `${filledWidth}px`;
    customHandleFirst.style.left = `${filledWidth - (customHandleFirst.offsetWidth / 2)}px`;
    // console.log(customFilledTrack.offsetWidth);
    // console.log(customHandleFirst.offsetWidth / 2);
    // console.log(customFilledTrack.getBoundingClientRect().right);
  }

  function sliderPercentage(inputSlider) {
    return (inputSlider.value - inputSlider.min) / (inputSlider.max - inputSlider.min);
  }

  function loadSliderValue() {
    durationSpan.innerHTML = currentDurationInMinutes;
    durationInput.value = currentDurationInMinutes;
    updateCustomSlider(sliderPercentage(durationInput));
  }
  loadSliderValue();

  durationInput.addEventListener('input', () => {
    const { value } = durationInput;
    durationSpan.innerHTML = value;
    updateCustomSlider(sliderPercentage(durationInput));
  });

  // add button functionality
  btnSave.addEventListener('click', () => {
    App.currentGame.duration = Tools.minutesToMS(durationInput.value);
    App.gameManager.saveCurrentGame();
    App.router.navigate('/room');
  });

  // Window listeners
  window.addEventListener('unload', () => {
    if (App.gameManager.currentGame) App.gameManager.leaveGame(App.userManager.currentUser);
  });
};
