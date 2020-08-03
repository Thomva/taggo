import Handlebars from 'handlebars';

export default (moderatorName, isPrivate, cssClass = '', duration, mapName, playerAmount, cardID = '') => {
  const escapedModeratorName = Handlebars.escapeExpression(moderatorName);
  const escapedDuration = Handlebars.escapeExpression(duration);
  const escapedMapName = Handlebars.escapeExpression(mapName);
  const escapedPlayerAmount = Handlebars.escapeExpression(playerAmount);
  const escapedCssClass = !cssClass || typeof cssClass !== 'string' ? '' : Handlebars.escapeExpression(cssClass);
  const escapedID = !cardID || typeof cardID !== 'string' ? '' : Handlebars.escapeExpression(cardID);
  // eslint-disable-next-line max-len
  // return escapedModeratorName !== '' ? new Handlebars.SafeString(`<div ${escapedCssClass !== '' ? `class="${escapedCssClass}"` : 'class="o-gameCard"'}><div class="o-gameCard__header"><span class="o-gameCard__moderator">${escapedModeratorName}</span></div><div class="o-gameCard__content"><span class="o-gameCard__duration">${escapedDuration} min</span><span class="o-gameCard__map">${escapedMapName}</span><span class="o-gameCard__players">${escapedPlayerAmount}</span></div><div class="o-gameCard__privateIcon">${isPrivate ? 'P' : ''}</div><div class="o-gameCard__moderatorIcon">M</div></div>`) : '';
  // <img src="../assets/icons/duration.svg">
  return escapedModeratorName !== '' ? new Handlebars.SafeString(
    `<div ${escapedCssClass !== '' ? `class="${escapedCssClass}"` : 'class="o-gameCard"'} ${escapedID !== '' ? `id="${escapedID}"` : 'class="o-gameCard"'}>
      <div class="o-gameCard__header">
        <span class="o-gameCard__moderator">${escapedModeratorName}</span>
      </div>
      <div class="o-gameCard__content">
        <div class="o-gameCard__duration">
          <div class="o-gameCard__durationIcon"></div>
          <span>${escapedDuration} min</span>
        </div>
        <div class="o-gameCard__map">
          <div class="o-gameCard__mapIcon"></div>
          <span>${escapedMapName}</span>
        </div>
        <div class="o-gameCard__players">
          <div class="o-gameCard__playersIcon"></div>
          <span>${escapedPlayerAmount}</span>
        </div>
      </div>
      ${isPrivate ? '<div class="o-gameCard__privateIconContainer"><div class="o-gameCard__privateIcon"></div></div>' : ''}
    </div>`,
  ) : '';
};
