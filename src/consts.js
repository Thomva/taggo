/**
 * Some Constants
 */
// debugging
export const DEBUGGING = false;

// general
export const SITE_TITLE = 'Taggo';

// router
export const ROUTER_HASH = '#';
export const ROUTER_DEFAULT_PAGE = 'login';
export const NO_AUTHENTICATION_PAGES = [
	'/login',
	'/register',
	'/register/username',
	'/forgot-password',
];

// mapbox
export const { MAPBOX_API_KEY } = process.env;

// firebase
export const INIT_FIREBASE = true;
export const { FIREBASE_API_KEY } = process.env;
export const { FIREBASE_PROJECT_ID } = process.env;
export const { FIREBASE_MESSAGING_SENDER_ID } = process.env;

// colors
export const COLOR_PRIMARY = '#4aa7cc';
export const COLOR_FREEMAN = '#39dbb0';
export const COLOR_HUNTER = '#b80101';

// vibration patterns
export const VIBRATE_ROLECHANGE = [1000];
export const VIBRATE_GAME_START = [1000];
export const VIBRATE_GAME_END = [500, 200, 500, 200, 1000];
export const VIBRATE_OUTSIDE_PLAYZONE = [1000, 200, 400];
