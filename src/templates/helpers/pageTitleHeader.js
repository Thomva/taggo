import Handlebars from 'handlebars';

export default (page) => {
  const headerText = page.data.root.title;
  const escapedHeaderText = Handlebars.escapeExpression(headerText);
  const escapedCssClass = Handlebars.escapeExpression('a-mainHeader');
  return escapedHeaderText !== '' ? new Handlebars.SafeString(`<h1 ${escapedCssClass !== '' ? `class="${escapedCssClass}"` : ''}>${escapedHeaderText}</h1>`) : '';
};
