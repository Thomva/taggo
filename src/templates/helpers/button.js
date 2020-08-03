import Handlebars from 'handlebars';

export default (buttonText, color, ID = '', cssClassSecondary = '') => {
  const escapedbuttonText = Handlebars.escapeExpression(buttonText);
  const escapedID = !ID || typeof ID !== 'string' ? '' : Handlebars.escapeExpression(ID);
  const escapedCssClassSecondary = !cssClassSecondary || typeof cssClassSecondary !== 'string' ? '' : Handlebars.escapeExpression(cssClassSecondary);
  let cssClassPrimary = '';
  // if (escapedCssClassSecondary === '') {
  switch (color) {
    case 0:
      cssClassPrimary = Handlebars.escapeExpression('a-button');
      break;
    case 1:
      cssClassPrimary = Handlebars.escapeExpression('a-button a-button--secondary');
      break;
    case 2:
      cssClassPrimary = Handlebars.escapeExpression('a-button a-button--tertiary');
      break;
    case 3:
      cssClassPrimary = Handlebars.escapeExpression('a-button a-button--quaternary');
      break;

    default:
      cssClassPrimary = Handlebars.escapeExpression('a-button');
      break;
  }
  // }
  // eslint-disable-next-line max-len
  // return escapedbuttonText !== '' ? new Handlebars.SafeString(`<a ${escapedCssClass !== '' ? `class="${escapedCssClass}"` : ''} ${escapedID !== '' ? `id="${escapedID}"` : ''}>${escapedbuttonText}</a>`) : '';
  return escapedbuttonText !== '' ? new Handlebars.SafeString(`<a class="${cssClassPrimary} ${escapedCssClassSecondary}" ${escapedID !== '' ? `id="${escapedID}"` : ''}>${escapedbuttonText}</a>`) : '';
};
