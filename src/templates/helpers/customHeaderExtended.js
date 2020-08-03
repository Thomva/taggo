import Handlebars from 'handlebars';

export default (headerText1, headerText2, usernameID = '', secondaryCssClass = '') => {
  const escapedHeaderText1 = Handlebars.escapeExpression(headerText1);
  const escapedHeaderText2 = Handlebars.escapeExpression(headerText2);
  const escapedUsernameID = !usernameID || typeof usernameID !== 'string' ? '' : Handlebars.escapeExpression(usernameID);
  const escapedSecondaryCssClass = !secondaryCssClass || typeof secondaryCssClass !== 'string' ? '' : Handlebars.escapeExpression(secondaryCssClass);
  const escapedCssClass = Handlebars.escapeExpression('m-extendedHeader');
  return (escapedHeaderText1 !== '' && escapedHeaderText2 !== '') ? new Handlebars.SafeString(`<div ${escapedCssClass !== `class="${escapedSecondaryCssClass}"` ? `class="${escapedCssClass} ${escapedSecondaryCssClass}"` : ''}><span class="m-extendedHeader__span">${escapedHeaderText1}</span><h1 class="m-extendedHeader__mainHeading" ${escapedUsernameID !== '' ? `id="${escapedUsernameID}"` : ''}>${escapedHeaderText2}</h1></div>`) : '';
};
