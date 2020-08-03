/**
 * Account Deletion Warnng
 */

import App from '../lib/App';

const warningTemplate = require('../templates/accountWarning.hbs');

export default () => {
  // set the title of this page
  const title = 'Settings';

  // render the template
  App.render(warningTemplate({ title }));


  const btnBack = document.getElementById('btn-back');
  const btnDeleteAccount = document.getElementById('btn-delete-confirm');

  // add button functionality
  btnBack.addEventListener('click', () => {
    App.router.navigate('/settings');
  });

  btnDeleteAccount.addEventListener('click', () => {
    App.deleteAccount(true);
  });
};
