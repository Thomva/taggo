/* eslint-disable max-len */
import Handlebars from 'handlebars';

export default (place, username, score, isYou = false, ID = '') => {
  const escapedPlace = Handlebars.escapeExpression(place);
  const escapedUsername = Handlebars.escapeExpression(username);
  const escapedScore = Handlebars.escapeExpression(score);
  const escapedID = !ID || typeof ID !== 'string' ? '' : Handlebars.escapeExpression(ID);
  // const you = isYou ? '(You)' : '';
  const you = isYou ? '' : '';
  // return new Handlebars.SafeString(
  //   `<div class="o-winnersList__winnerElement" ${escapedID ? `id="${escapedID}"` : ''}>
  //   <span class="o-winnersList__place o-winnersList__place--${escapedPlace}"></span>
  //   <span class="o-winnersList__playerName">${escapedUsername} ${you}</span>
  //   <span class="o-winnersList__score">${escapedScore}</span>
  //   </div>`,
  // );
  return new Handlebars.SafeString(
    `<div class="o-winnersList__winnerElement o-winnersList__winnerElement--${escapedPlace}" ${escapedID ? `id="${escapedID}"` : ''}>
      <span class="o-winnersList__place">${escapedPlace}</span>
      <span class="o-winnersList__playerName">${escapedUsername} ${you}</span>
      <span class="o-winnersList__score">${escapedScore}</span>
    </div>`,
  );
};
