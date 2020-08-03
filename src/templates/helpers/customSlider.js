/* eslint-disable max-len */
import Handlebars from 'handlebars';

export default (sliderID, min, max, value, isDuoSlider = false) => {
  const escapedSliderID = !sliderID || typeof sliderID !== 'string' ? '' : Handlebars.escapeExpression(sliderID);
  const escapedIsDuoSlider = typeof isDuoSlider === 'boolean' ? isDuoSlider : false;
  if (!escapedIsDuoSlider) {
    return new Handlebars.SafeString(`
    <div class="m-customSlider" id="full-track">
      <div class="m-customSlider__filledTrack" id="filled-track"></div>
      <div class="m-customSlider__handleContainer" id="handle-first"><div class="m-customSlider__handle"></div></div>
    </div>
    <input ${escapedSliderID ? `id="${escapedSliderID}"` : 'id="duration"'} type="range" min="${min}" max="${max}" value="${value}" class="m-slider__inputSlider"></input>`);
  }
  return null;
  // return new Handlebars.SafeString(`
  //   <div class="m-customSlider" id="full-track">
  //     <div class="m-customSlider__filledTrack" id="filled-track"></div>
  //     <div class="m-customSlider__handle" id="handle-first"></div>
  //     <div class="m-customSlider__handle" id="handle-second"></div>
  //   </div>
  //   <input ${escapedSliderID ? `id="${escapedSliderID}"` : 'id="duration"'} type="range" min="${min}" max="${max}" value="${value}" class="m-slider__inputSlider"></input>`);
};
