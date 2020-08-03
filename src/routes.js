// import pages
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import RegisterUsernamePage from './pages/registerUsername';
import ForgotPasswordPage from './pages/forgotPassword';

import HomePage from './pages/home';
import SettingsPage from './pages/settings';
import SettingsUsernamePage from './pages/settingsUsername';
import SettingsPasswordPage from './pages/settingsPassword';
import AccountWarningPage from './pages/accountWarning';

import LobbyPage from './pages/lobby';
import LobbyDurationPage from './pages/lobbyDuration';
import LobbyMapPage from './pages/lobbyMap';
import LobbyPrivatePage from './pages/lobbyPrivate';
import LobbyPasswordPage from './pages/lobbyPassword';
import RoomPage from './pages/room';
import RoomDurationPage from './pages/roomDuration';
import RoomMapPage from './pages/roomMap';
import RoomInvitePage from './pages/roomInvite';

import GamePage from './pages/game';
import GameFinishPage from './pages/gameFinish';
import GameUnavailablePage from './pages/gameUnavailable';

import AdminPage from './pages/admin';

import FirebasePage from './pages/firebase';
import MapboxPage from './pages/mapbox';

export default [
  // Log in / register
  { path: '/login', view: LoginPage },
  { path: '/register', view: RegisterPage },
  { path: '/register/username', view: RegisterUsernamePage },
  { path: '/forgot-password', view: ForgotPasswordPage },

  // Home & settings
  { path: '/home', view: HomePage },
  { path: '/settings', view: SettingsPage },
  { path: '/settings/username', view: SettingsUsernamePage },
  { path: '/settings/password', view: SettingsPasswordPage },
  { path: '/account-warning', view: AccountWarningPage },

  // Pre-game
  { path: '/lobby', view: LobbyPage },
  { path: '/lobby/duration', view: LobbyDurationPage },
  { path: '/lobby/map', view: LobbyMapPage },
  { path: '/lobby/private', view: LobbyPrivatePage },
  { path: '/lobby/password', view: LobbyPasswordPage },
  { path: '/room', view: RoomPage },
  { path: '/room/duration', view: RoomDurationPage },
  { path: '/room/map', view: RoomMapPage },
  { path: '/room/invite', view: RoomInvitePage },

  // Game
  { path: '/game', view: GamePage },
  { path: '/game/finish', view: GameFinishPage },
  { path: '/game-unavailable', view: GameUnavailablePage },

  // Admin
  { path: '/admin', view: AdminPage },

  // Standard
  { path: '/firebase', view: FirebasePage },
  { path: '/mapbox', view: MapboxPage },
];
