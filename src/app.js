import './styles/styles.scss';

import * as consts from './consts';
import App from './lib/App';
import routes from './routes';

/**
 * This function will initialize our app
 */
const initApp = async () => {
  // create a DOM element for our renderer
  const app = document.createElement('div');
  app.setAttribute('id', 'app');
  document.body.appendChild(app);

  // Show debug navigation when DEBUGGING
  if (consts.DEBUGGING) {
    document.querySelector('.o-debug').style.display = 'initial';
  } else {
    document.querySelector('.o-debug').style.display = 'none';
  }

  // 1. set the core
  App.initCore({
    mainUrl: window.location.origin,
    hash: consts.ROUTER_HASH,
    element: app,
  });

  // 2. init firebase (if needed)
  if (consts.INIT_FIREBASE) {
    App.initFireBase({
      apiKey: consts.FIREBASE_API_KEY,
      projectId: consts.FIREBASE_PROJECT_ID,
      messagingSenderId: consts.FIREBASE_MESSAGING_SENDER_ID,
    });
  }

  // 3. init storage
  App.initStorage();

  // 4. init managers
  await App.initManagers();

  // 5. init dataseeder
  App.initDataSeeder();

  // 6. init serviceworkers
  App.initServiceWorkers();
};

/**
 * This function will init the routes
 */
const initRoutes = () => {
  routes.forEach((route) => App.router.addRoute(route.path, route.view));
};

/**
 * When we are ready to go, init the app, routes and navigate to default route
 */
window.addEventListener('load', async () => {
  // init the app
  await initApp();

  // init the routes
  initRoutes();

  // go full screen
  // const requestFullScreen = document.requestFullscreen || document.mozRequestFullScreen
  //   || document.webkitRequestFullScreen || document.msRequestFullscreen;
  // function requestFullScreen(documentElement) {
  //   const reqFS = documentElement.requestFullscreen || documentElement.mozRequestFullScreen
  //   || documentElement.webkitRequestFullScreen || documentElement.msRequestFullscreen;
  //   console.log('requesting full screen');
  //   console.log(reqFS);
  //   reqFS.call(documentElement);
  // }

  // requestFullScreen(document.documentElement);
  // document.requestFullscreen();

  // route to the requested location (or default)
  let requestedPage = window.location.hash.split('/')[1];
  requestedPage = (requestedPage === null || typeof (requestedPage) === 'undefined') ? `/${consts.ROUTER_DEFAULT_PAGE}` : `/${requestedPage}`;
  App.router.navigate(requestedPage);
});
