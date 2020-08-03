import Handlebars from 'handlebars';

export default (headerText, ID) => {
  const escapedHeaderText = Handlebars.escapeExpression(headerText);
  const escapedID = !ID || typeof ID !== 'string' ? '' : Handlebars.escapeExpression(ID);
  const escapedCssClass = Handlebars.escapeExpression('a-mainHeader');
  return escapedHeaderText !== '' ? new Handlebars.SafeString(`<h1 ${escapedCssClass !== '' ? `class="${escapedCssClass}"` : ''} ${escapedID !== '' ? `id="${escapedID}"` : ''}>${escapedHeaderText}</h1>`) : '';
};
