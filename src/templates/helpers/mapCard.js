import Handlebars from 'handlebars';

export default (mapName, distance, cssClass = '', mapID) => {
  const escapedMapName = Handlebars.escapeExpression(mapName);
  const escapedDistance = Handlebars.escapeExpression(distance);
  const escapedMapID = Handlebars.escapeExpression(mapID);
  const escapedCssClass = !cssClass || typeof cssClass !== 'string' ? '' : Handlebars.escapeExpression(cssClass);
  return escapedMapName !== '' ? new Handlebars.SafeString(`<div ${escapedCssClass !== '' ? `class="${escapedCssClass}"` : 'class="o-mapCard"'} id="${escapedMapID}"><div class="o-mapCard__header"><span class="o-mapCard__mapName" id="mapName-${escapedMapID}">${escapedMapName}</span><span class="o-mapCard__distance" id="distance-${escapedMapID}">${escapedDistance}</span></div></div>`) : '';
};
