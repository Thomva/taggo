/* eslint-disable no-param-reassign */

/**
 * The main App
 *
 * @author Tim De Paepe <tim.depaepe@arteveldehs.be>
 * @author Thomas Van de Velde <thomvand26@student.arteveldehs.be>
 */

import { DEBUGGING, ROUTER_DEFAULT_PAGE, NO_AUTHENTICATION_PAGES } from '../consts';

import Tools from './core/Tools';
import Router from './core/Router';
import Renderer from './core/Renderer';
import FireBase from './core/FireBase';

import TempStorage from './core/TempStorage';
import UserStorage from './core/UserStorage';
import MapStorage from './core/MapStorage';
import GameStorage from './core/GameStorage';

import GameManager from './core/GameManager';
import UserManager from './core/UserManager';
import MapManager from './core/MapManager';
import LocationManager from './core/LocationManager';
import NotificationManager from './core/NotificationManager';
import DataSeeder from './core/DataSeeder';
import Authentication from './core/Authentication';
import Lobby from './core/Lobby';

class App {
  static initCore({ mainUrl, hash, element }) {
    this._router = new Router(mainUrl, hash);
    this._renderer = new Renderer(element, this.router);
    this._lobby = new Lobby();
  }

  static initFireBase({ apiKey, projectId, messagingSenderId }) {
    this._firebase = new FireBase(apiKey, projectId, messagingSenderId);
    this._firebase.addOnUserFunction(this.onAuthStateUser.bind(this));
    this._firebase.addOnNoUserFunction(this.onAuthStateNoUser.bind(this));
  }

  static initStorage() {
    this._tempStorage = new TempStorage();

    this._authentication = new Authentication(
      this._firebase.getAuth(),
      this._firebase.getGoogleAuthProvider(),
    );

    this._userStorage = new UserStorage(
      this._firebase.getFirestore(),
      this._firebase.getRealtimeDatabase(),
    );

    this._mapStorage = new MapStorage(
      this._firebase.getFirestore(),
      this._firebase.getRealtimeDatabase(),
    );

    this._gameStorage = new GameStorage(
      this._firebase.getFirestore(),
      this._firebase.getRealtimeDatabase(),
    );
  }

  static async initManagers() {
    this._locationManager = new LocationManager();
    this._notificationManager = new NotificationManager();
    this._userManager = new UserManager(this._userStorage);
    this._mapManager = new MapManager(this._mapStorage);
    await this._mapManager.loadMaps();
    this._gameManager = new GameManager(
      this._gameStorage,
      this._mapManager,
      this._userManager,
      this._locationManager,
      this._router,
      this._tempStorage,
      this._notificationManager,
    );
    await this._gameManager.loadGames();
    this._userManager.gameManager = this._gameManager;
  }

  static initDataSeeder() {
    this._dataSeeder = new DataSeeder(this._mapManager, this._gameManager, this._userManager);
  }

  static initServiceWorkers() {
    if (navigator.serviceWorker) {
      navigator.serviceWorker
        .register('../sw.js')
        .then((reg) => {
          console.log(reg);
        })
        .catch((error) => {
          console.log(`SW error: ${error}`);
        });
    } else {
      console.log('SW NOT supported');
    }
  }

  static get router() {
    return this._router;
  }

  static get renderer() {
    return this._renderer;
  }

  static get firebase() {
    if (!this._firebase) throw new Error('Firebase was not initialized!');
    return this._firebase;
  }

  static get TempStorage() {
    return this._tempStorage;
  }

  static get hasFireBase() {
    return !Tools.isUndefined(this._firebase);
  }

  static get locationManager() {
    return this._locationManager;
  }

  static render(html) {
    if (!this._renderer) throw new Error('The App Core was not initialized!');
    this._renderer.render(html);
  }

  static get notificationManager() {
    return this._notificationManager;
  }


  // Authentication

  static get authentication() {
    return this._authentication;
  }

  static loginWithEmail(
    email,
    password,
    showEmailError,
    showPasswordError,
  ) {
    if (email && password) {
      if (!this._userManager.currentUser) {
        this._authentication.logInWithEmailAndPassword(
          email,
          password,
          showEmailError,
          showPasswordError,
          (credentials) => {
            // console.log('logged in with email');
            this.loginFinalization(
              credentials.user.uid,
            );
          },
        );
      }
    }
  }

  static loginWithGoogle() {
    this._authentication.logInWithGoogle(
      (credentials) => {
        this.loginFinalization(
          credentials.user.uid,
        );
      },
    );
  }

  static createAccount(
    email,
    password,
    showEmailError = null,
    showPasswordError = null,
    onSuccess = null,
  ) {
    if (email && password) {
      this._authentication.createUserWithEmailAndPassword(
        email,
        password,
        showEmailError,
        showPasswordError,
        () => {
          if (onSuccess) onSuccess();
          this.router.navigate('/register/username');
        },
      );
    }
  }

  static createAccountFinalization(username, showUsernameError) {
    const userID = this.firebase.getAuth().currentUser.uid;

    showUsernameError('');
    const newUser = this._userManager.createUser(username, userID);

    // Save in database
    this.userManager.saveUser(newUser);

    this.router.navigate('/home');
  }

  static async loginFinalization(userID, onLogin = null, onNoUserInDB = null) {
    if (this.TempStorage.getItem('loginToDelete')) {
      this.deleteAccount(true);
      return;
    }
    await this.createUserFromDB(userID, onLogin, onNoUserInDB);
  }

  static logout(onLogout = null) {
    this._authentication.logout(onLogout);
    this.router.navigate('/login');
    this._userManager.currentUser = null;
  }

  static deleteAccount(notifyOnDeletion = false) {
    this.TempStorage.deleteItem('loginToDelete');
    App.authentication.deleteCurrentAccount(
      () => {
        if (notifyOnDeletion) this.notificationManager.notifyUser('Please log back in to delete your account.', null, 'account');
        this.TempStorage.setItem('loginToDelete', true);
        this.TempStorage.deleteItem('requestedPage');
        this.logout();
      },
      () => {
        App.TempStorage.deleteItem('requestedPage');

        if (notifyOnDeletion) this.notificationManager.notifyUser('Your account has been successfully deleted.', null, 'account');

        // Go to /register
        App.router.navigate('/register');
      },
      () => {
        App.router.navigate('/settings');
      },
    );
  }


  static async onAuthStateUser(user) {
    if (!DEBUGGING) {
      await this.createUserFromDB(user.uid);
    }

    const requestedPage = App.TempStorage.getItem('requestedPage');
    if (requestedPage) {
      App.TempStorage.deleteItem('requestedPage');
      App.router.navigate(requestedPage);
    }
  }

  static onAuthStateNoUser() {
    //
  }


  // Users

  static get userManager() {
    return this._userManager;
  }

  static async createUserFromDB(userID, onSuccess = null, onNoUserInDB = null) {
    await this._userStorage.getUser(
      userID,
      (userData) => {
        if (!userData.username) {
          this.router.navigate('/register/username');
        } else {
          const newUser = this._userManager.createUser(userData.username, userID);
          if (onSuccess) onSuccess(newUser);
        }
      },
      () => {
        // User probably hasn't finalized the account creation.
        // Go to the register/username page
        this.router.navigate('/register/username');
        if (onNoUserInDB) onNoUserInDB();
      },
    );
  }

  static get currentUser() {
    return this._userManager.currentUser;
  }


  // Games

  static get gameManager() {
    return this._gameManager;
  }

  static get gameStorage() {
    return this._gameStorage;
  }

  static createGame(moderator = this.userManager.currentUser, map = this._mapManager.allMaps[0], password = '', duration = Tools.minutesToMS(20), isPrivate = false) {
    console.log(this._mapManager.allMaps);
    const newGame = this._gameManager.createGame(
      moderator,
      map,
      password,
      duration,
      isPrivate,
      this.router,
    );
    this._userManager.currentUser.game = newGame;
    return newGame;
  }

  static createDebugGame() {
    const { currentUser } = this.userManager;

    const newGame = this._gameManager.createGame(
      currentUser,
      this._mapManager.allMaps[0],
      '',
      Tools.minutesToMS(20),
      false,
      this.router,
      true,
    );

    this._dataSeeder.allUsers.forEach((user) => {
      user.game = this.currentGame;
      user.ready = true;
      newGame.addPlayer(user, this.gameManager);
    });

    currentUser.ready = false;
    currentUser.game = newGame;
    return newGame;
  }

  static get currentModerator() {
    return this._gameManager.currentGame ? this._gameManager.currentGame.moderator : null;
  }

  static set currentGame(game) {
    this._gameManager.currentGame = game;
  }

  static get currentGame() {
    return this._gameManager.currentGame;
  }

  static get allGames() {
    return this._gameManager.allGames;
  }

  static tryJoinGame(game) {
    if (game.isPrivate) {
      this.lobby.privateGame = game;
      this.router.navigate('/lobby/password');
    } else {
      this.joinGame(game);
    }
  }

  static joinGame(game) {
    this.gameManager.joinGame(game);
  }


  // Maps

  static get mapStorage() {
    if (!this._mapStorage) throw new Error('MapStorage error!');
    return this._mapStorage;
  }

  static get mapManager() {
    return this._mapManager;
  }

  static get currentMap() {
    return this._gameManager.currentGame.map;
  }

  static addUserLocator(user) {
    this.currentMap.addUserLocator(user);
  }


  // Lobby

  static get lobby() {
    return this._lobby;
  }


  // DataSeeder

  static get dataSeeder() {
    return this._dataSeeder;
  }


  // Page

  static onPageLoad(needToBeLoggedIn = true, callback = null) {
    let requestedPage = window.location.hash.split('/')[1];
    requestedPage = (requestedPage === null || typeof (requestedPage) === 'undefined') ? `/${ROUTER_DEFAULT_PAGE}` : `/${requestedPage}`;
    if (!NO_AUTHENTICATION_PAGES.includes(requestedPage)) {
      App.TempStorage.setItem('requestedPage', requestedPage);
    }

    const currentFirebaseUser = this.firebase.getAuth().currentUser;
    if (needToBeLoggedIn) {
      if (!DEBUGGING) {
        if (currentFirebaseUser) {
          if (!this.userManager.currentUser) {
            this.createUserFromDB(currentFirebaseUser.uid, callback);
          }
        } else {
          this.router.navigate('/login');
        }
      }
    } else if (!DEBUGGING) {
      if (currentFirebaseUser) {
        this.router.navigate('/home');
      } else if (this.userManager.currentUser) {
        this.logout();
      }
    }
  }
}

export default App;
