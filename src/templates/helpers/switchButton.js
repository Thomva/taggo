import Handlebars from 'handlebars';

export default (buttonText1, buttonText2, ID = '') => {
  const escapedbuttonText1 = Handlebars.escapeExpression(buttonText1);
  const escapedbuttonText2 = Handlebars.escapeExpression(buttonText2);
  const escapedID = !ID || typeof ID !== 'string' ? '' : Handlebars.escapeExpression(ID);
  // <label class="m-switchButton">
  //   <input type="checkbox" class="m-switchButton__checkbox" id="">
  //   <span class="m-switchButton__slider"></span>
  // </label>
  // eslint-disable-next-line max-len
  // return (escapedbuttonText1 !== '' && escapedbuttonText2 !== '') ? new Handlebars.SafeString(`<label class="m-switchButton" ${escapedID !== '' ? `id="${escapedID}"` : ''}><input type="checkbox" class="m-switchButton__checkbox"><span class="m-switchButton__slider"></span><div class="m-switchButton__textContainer"><span class="m-switchButton__text">${escapedbuttonText1}</span><span class="m-switchButton__text">${escapedbuttonText2}</span></div></label>`) : '';
  return (escapedbuttonText1 !== '' && escapedbuttonText2 !== '') ? new Handlebars.SafeString(`
  <label class="m-switchButton" ${escapedID !== '' ? `id="${escapedID}"` : ''}>
    <input type="checkbox" class="m-switchButton__checkbox" id="${escapedID}-checkbox">
    <span class="m-switchButton__slider"></span>
    <div class="m-switchButton__textContainer">
      <div class="m-switchButton__textBG"></div>
      <span class="m-switchButton__text m-switchButton__text--first">${escapedbuttonText1}</span>
      <span class="m-switchButton__text m-switchButton__text--second">${escapedbuttonText2}</span>
    </div>
  </label>`) : '';
};
