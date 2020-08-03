/* eslint-disable max-len */
import Handlebars from 'handlebars';

export default (username, isYou = false, isModerator = false, cssClass = '', ID = '', isReady = false) => {
  const escapedUsername = Handlebars.escapeExpression(username);
  const escapedID = !ID || typeof ID !== 'string' ? '' : Handlebars.escapeExpression(ID);
  const escapedCssClass = !cssClass || typeof cssClass !== 'string' ? '' : Handlebars.escapeExpression(cssClass);
  // return escapedbuttonText !== '' ? new Handlebars.SafeString(`<a ${escapedCssClass !== '' ? `class="${escapedCssClass}"` : ''} ${escapedID !== '' ? `id="${escapedID}"` : ''}>${escapedbuttonText}</a>`) : '';
  const you = isYou ? '(You)' : '';
  const mod = isModerator ? '<span id="moderator-icon">M</span>' : '';
  return `<div ${escapedCssClass !== '' ? `class="${escapedCssClass}"` : 'class="m-roomPlayers__playerElement"'} ${escapedID !== '' ? `id="${escapedID}"` : ''}}><span class="m-roomPlayers__playerName">${escapedUsername} ${you}${mod}</span><div class="m-roomPlayers__rightContainer"><span class="m-roomPlayers__readySpan${isReady ? ' m-roomPlayers__readySpan--ready' : ''}">Ready</span>${isModerator ? '' : '<a class="m-roomPlayers__kickButton">kick</a>'}</div></div>`;
};
