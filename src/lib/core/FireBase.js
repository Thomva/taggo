/**
 * A FireBase Wrapper
 * docs: https://firebase.google.com/docs
 *
 * @author Tim De Paepe <tim.depaepe@arteveldehs.be>
 * @author Thomas Van de Velde <thomvand26@student.arteveldehs.be>
 */

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';

import Tools from './Tools';

class FireBase {
  constructor(apiKey, projectId, messagingSenderId) {
    this.apiKey = apiKey;
    this.projectId = projectId;
    this.messagingSenderId = messagingSenderId;

    this.googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    this.onUserFunctions = [];
    this.onNoUserFunctions = [];
    this.initializeApp();
  }

  initializeApp() {
    firebase.initializeApp(this.getFireBaseConfig());

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.onUserFunctions.forEach((callback) => {
          if (callback) callback(user);
        });
      } else {
        this.onNoUserFunctions.forEach((callback) => {
          if (callback) callback();
        });
      }
    });
  }

  getFireBaseConfig() {
    return {
      apiKey: `${this.apiKey}`,
      authDomain: `${this.projectId}.firebaseapp.com`,
      databaseURL: `https://${this.projectId}.firebaseio.com`,
      projectId: `${this.projectId}`,
      storageBucket: `${this.projectId}.appspot.com`,
      messagingSenderId: `${this.messagingSenderId}`,
    };
  }

  getFirestore() {
    return firebase.firestore();
  }

  getRealtimeDatabase() {
    return firebase.database();
  }

  getAuth() {
    return firebase.auth();
  }

  getGoogleAuthProvider() {
    return this.googleAuthProvider;
  }

  addOnUserFunction(callback) {
    this.onUserFunctions.push(callback);
  }

  removeOnUserFunction(callback) {
    Tools.removeFromArray(callback, this.onUserFunctions);
  }

  addOnNoUserFunction(callback) {
    this.onUserFunctions.push(callback);
  }

  removeOnNoUserFunction(callback) {
    Tools.removeFromArray(callback, this.onUserFunctions);
  }
}

export default FireBase;
