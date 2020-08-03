import Handlebars from 'handlebars';

export default (label, placeholder, cssClass = '', inputID) => {
  const escapedLabel = Handlebars.escapeExpression(label);
  const escapedPlaceholder = Handlebars.escapeExpression(placeholder);
  const escapedInputID = Handlebars.escapeExpression(inputID);
  const escapedCssClass = !cssClass || typeof cssClass !== 'string' ? 'm-inputText' : Handlebars.escapeExpression(cssClass);
  return label !== '' ? new Handlebars.SafeString(`<div ${escapedCssClass !== '' ? `class="${escapedCssClass}"` : ''}><label for="${escapedInputID}" class="m-inputText__label">${escapedLabel}</label><input id="${escapedInputID}" type="password" placeholder="${escapedPlaceholder}" class="m-inputText__input"><span class="m-inputText__error"></span></div>`) : '';
};
