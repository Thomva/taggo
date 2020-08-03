/**
 * Authentication
 *
 * @author Thomas Van de Velde <thomvand26@student.arteveldehs.be>
 */

export default class Authentication {
  constructor(firebaseAuth, googleAuthProvider) {
    this.firebaseAuth = firebaseAuth;
    this.googleAuthProvider = googleAuthProvider;
  }

  createUserWithEmailAndPassword(
    email,
    password,
    showEmailError,
    showPasswordError,
    onSuccess = null,
  ) {
    return this.firebaseAuth.createUserWithEmailAndPassword(email, password)
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        switch (errorCode) {
          case 'auth/invalid-email':
            showEmailError(errorMessage);
            break;
          case 'auth/email-already-in-use':
            showEmailError('This email address already has an account.');
            break;
          case 'auth/operation-not-allowed':
            showEmailError('Email/password accounts are currently disabled.');
            break;
          case 'auth/weak-password':
            showPasswordError(errorMessage);
            break;

          default:
            break;
        }
      })
      .then((userCredentials) => {
        if (userCredentials) {
          if (onSuccess) onSuccess(userCredentials);
        }
      });
  }

  logInWithEmailAndPassword(
    email,
    password,
    showEmailError,
    showPasswordError,
    onSuccess,
  ) {
    return this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        switch (errorCode) {
          case 'auth/invalid-email':
            showEmailError(errorMessage);
            break;
          case 'auth/user-disabled':
            showEmailError('This account is banned.');
            break;
          case 'auth/user-not-found':
            showEmailError('This email address has no account.');
            break;
          case 'auth/wrong-password':
            showPasswordError('The password is incorrect.');
            break;

          default:
            break;
        }
      })
      .then((userCredentials) => {
        if (userCredentials) onSuccess(userCredentials);
      });
  }

  logInWithGoogle(onSuccess = null) {
    this.firebaseAuth.signInWithPopup(this.googleAuthProvider)
      .catch((error) => {
        console.log(`logInWithGoogle Error: ${error}`);
      })
      .then((result) => {
        if (onSuccess) onSuccess(result);
      });
  }

  logout(onSuccess = null) {
    this.firebaseAuth.signOut()
      .then(() => {
        if (onSuccess) onSuccess();
      });
  }

  sendResetLink(email, showEmailError, onSuccess = null) {
    return this.firebaseAuth.sendPasswordResetEmail(email)
      .catch((error) => {
        console.log(`sendResetLink Error: ${error}`);
        const errorCode = error.code;
        const errorMessage = error.message;

        switch (errorCode) {
          case 'auth/invalid-email':
            showEmailError(errorMessage);
            return errorMessage;
          case 'auth/user-not-found':
            showEmailError('This email address has no account.');
            return errorMessage;
          case 'auth/missing-android-pkg-name':
          case 'auth/missing-continue-uri':
          case 'auth/missing-ios-bundle-id':
          case 'auth/invalid-continue-uri':
          case 'auth/unauthorized-continue-uri':
            showEmailError('An unknown error occurred.');
            return errorMessage;

          default:
            return error;
        }
      })
      .then((error2) => {
        if (!error2) {
          if (onSuccess) onSuccess();
        }
      });
  }

  deleteCurrentAccount(onRecentAuthNeeded, onSuccess = null, onError = null) {
    this.firebaseAuth.currentUser.delete()
      .then(() => {
        if (onSuccess) onSuccess();
      })
      .catch((error) => {
        if (error.code === 'auth/requires-recent-login') {
          onRecentAuthNeeded();
        }
        console.log(`Delete Account Error: ${error.code}`);
        if (onError) onError();
      });
  }

  deleteCurrentAccountRecent(credentials, onSuccess, onError = null) {
    this.firebaseAuth.currentUser.reauthenticateWithCredential(credentials)
      .catch((error) => {
        console.log(`ReAuthentication Error: ${error.code}`);
        if (onError) onError();
      })
      .then(this.deleteCurrentAccount(null, onSuccess));
  }
}
