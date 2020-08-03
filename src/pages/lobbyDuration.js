/* eslint-disable max-len */
/**
 * The Lobby Duration Page
 */

import Hammer from 'hammerjs';
import App from '../lib/App';
import Tools from '../lib/core/Tools';


const lobbyDurationTemplate = require('../templates/lobbyDuration.hbs');

export default () => {
  // set the title of this page
  const title = 'Game Duration';

  // render the template
  App.render(lobbyDurationTemplate({ title }));

  App.onPageLoad(true);


  const btnSave = document.getElementById('btn-save');
  const switchAllCustom = document.getElementById('btn-all-custom');
  const checkboxAllCustom = document.querySelector('#btn-all-custom > input');

  const fullSliderContainer = document.getElementById('full-slider');
  const sliderContainer = document.getElementById('testSlider');
  const filledTrack = document.getElementById('filled-track');
  const handle1 = document.getElementById('handle-first');
  const handle2 = document.getElementById('handle-second');

  const handleRadius = handle1.offsetWidth / 2;
  const initHandlePosX = handle1.getBoundingClientRect().left;
  const boundMinX = sliderContainer.getBoundingClientRect().left;
  const boundMaxX = sliderContainer.getBoundingClientRect().right;

  const sliderLimits = { min: 5, max: 60 };
  const sliderValues = {};

  let lastMaxPos = Infinity;
  let lastMinPos = -Infinity;

  const durationSpan = document.getElementById('duration-span');

  let customDuration = App.lobby.durationFilter;

  const hammer1 = new Hammer(handle1, {
    recognizers: [
      [Hammer.Pan, { threshold: 1 }],
    ],
  });

  const hammer2 = new Hammer(handle2, {
    recognizers: [
      [Hammer.Pan, { threshold: 1 }],
    ],
  });

  function handlePositionFromPercentage(percentage) {
    return sliderContainer.offsetWidth * percentage;
  }

  function handlePositionFromValue(value) {
    const percentage = (Math.round(Tools.MSToMinutes(value)) - sliderLimits.min) / (sliderLimits.max - sliderLimits.min);
    return handlePositionFromPercentage(percentage);
  }

  function handlePercentage(position) {
    return position / sliderContainer.offsetWidth;
  }

  function handleValue(position) {
    const percentage = handlePercentage(position);
    return Math.round(((sliderLimits.max - sliderLimits.min) * percentage) + sliderLimits.min);
  }

  function updateSlider() {
    filledTrack.style.left = `${handle1.offsetLeft + handleRadius}px`;
    const handleDif = Math.abs(handle1.getBoundingClientRect().left - handle2.getBoundingClientRect().left);
    filledTrack.style.width = `${handleDif}px`;
    durationSpan.innerHTML = `${sliderValues.min || 5} - ${sliderValues.max || 60}`;
  }

  function updateAvailabilitySlider() {
    fullSliderContainer.style.opacity = customDuration ? '1' : '0.4';
  }

  function setHTML() {
    let handlePos1;
    let handlePos2;
    if (customDuration) {
      checkboxAllCustom.setAttribute('checked', true);
      handlePos1 = handlePositionFromValue(App.lobby.durationFilter.from);
      handlePos2 = handlePositionFromValue(App.lobby.durationFilter.to);
      handle1.style.left = `${handlePos1 - handleRadius}px`;
      handle2.style.left = `${handlePos2 - handleRadius}px`;
    } else {
      handlePos1 = handlePositionFromPercentage(0);
      handlePos2 = handlePositionFromPercentage(1);
      handle1.style.left = `${handlePos1 - handleRadius}px`;
      handle2.style.left = `${handlePos2 - handleRadius}px`;
    }
    sliderValues.min = handleValue(handlePos1);
    sliderValues.max = handleValue(handlePos2);

    lastMinPos = handlePos1 + initHandlePosX;
    lastMaxPos = handlePos2 + initHandlePosX;

    updateSlider();
    updateAvailabilitySlider();
  }
  setHTML();

  hammer1.on('pan', (e) => {
    if (customDuration) {
      const handlePos = Tools.clamp(e.center.x, boundMinX, Math.min(boundMaxX, lastMaxPos)) - initHandlePosX;
      handle1.style.left = `${handlePos - handleRadius}px`;
      sliderValues.min = handleValue(handlePos);
      lastMinPos = handlePos + initHandlePosX;
      updateSlider();
    }
  });

  hammer2.on('pan', (e) => {
    if (customDuration) {
      const handlePos = Tools.clamp(e.center.x, Math.max(boundMinX, lastMinPos), boundMaxX) - initHandlePosX;
      handle2.style.left = `${handlePos - handleRadius}px`;
      sliderValues.max = handleValue(handlePos);
      lastMaxPos = handlePos + initHandlePosX;
      updateSlider();
    }
  });

  switchAllCustom.addEventListener('change', () => {
    customDuration = checkboxAllCustom.checked;
    updateAvailabilitySlider();
  });

  // add button functionality
  btnSave.addEventListener('click', () => {
    if (customDuration) {
      App.lobby.durationFilter = {
        from: Tools.minutesToMS(sliderValues.min || 5),
        to: Tools.minutesToMS(sliderValues.max || 60),
      };
      if (
        Tools.MSToMinutes(App.lobby.durationFilter.from) === sliderLimits.min
        && Tools.MSToMinutes(App.lobby.durationFilter.to) === sliderLimits.max) {
        App.lobby.durationFilter = null;
      }
    } else {
      App.lobby.durationFilter = null;
    }
    App.router.navigate('/lobby');
  });
};
