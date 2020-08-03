import Handlebars from 'handlebars';

export default (buttonText, style, ID = '', cssClassSecondary = '') => {
  const escapedbuttonText = Handlebars.escapeExpression(buttonText);
  const escapedID = !ID || typeof ID !== 'string' ? '' : Handlebars.escapeExpression(ID);
  const escapedCssClassSecondary = !cssClassSecondary || typeof cssClassSecondary !== 'string' ? '' : Handlebars.escapeExpression(cssClassSecondary);
  let cssClassPrimary = '';

  switch (style) {
    case 0:
      cssClassPrimary = Handlebars.escapeExpression('a-playButton');
      break;
    case 1:
      cssClassPrimary = Handlebars.escapeExpression('a-playButton a-playButton--secondary');
      break;
    case 2:
      cssClassPrimary = Handlebars.escapeExpression('a-playButton a-playButton--tertiary');
      break;
    case 3:
      cssClassPrimary = Handlebars.escapeExpression('a-playButton a-playButton--quaternary');
      break;

    default:
      cssClassPrimary = Handlebars.escapeExpression('a-playButton');
      break;
  }
  return escapedbuttonText !== '' ? new Handlebars.SafeString(`<div class="${cssClassPrimary} ${escapedCssClassSecondary}" ${escapedID !== '' ? `id="${escapedID}"` : ''}><a class="a-playButton__border">${escapedbuttonText}</a></div>`) : '';
};
