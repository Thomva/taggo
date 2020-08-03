/**
 * Cloud Storage
 *
 * @author Thomas Van de Velde <thomvand26@student.arteveldehs.be>
 */

export default class CloudStorage {
  constructor(firestore, realtimeDB) {
    this.firestore = firestore;
    this.realtimeDB = realtimeDB;
  }

  async getDocument(collection, documentID, onSuccess = null, onNotExist = null) {
    await this.firestore.collection(collection).doc(documentID).get()
      .catch((error) => {
        console.log(`Error getting document:${error}`);
      })
      .then((doc) => {
        if (doc.exists) {
          if (onSuccess) onSuccess(doc.data());
        } else if (onNotExist) {
          onNotExist();
        }
      });
  }

  async getDocumentRT(collection, documentID, onSuccess = null, onNotExist = null) {
    await this.realtimeDB.ref(`${collection}/${documentID}`).once('value')
      .catch((error) => {
        console.log(`Error setting document (RTDB):${error}`);
      })
      .then((doc) => {
        if (doc.exists()) {
          if (onSuccess) onSuccess(doc.val());
        } else if (onNotExist) {
          onNotExist();
        }
      });
  }

  async getCollection(collection, onSuccess = null, onError = null) {
    await this.firestore.collection(collection).get()
      .catch((error) => {
        console.log(`Error getting collection:${error}`);

        if (onError) onError();
      })
      .then((col) => {
        const docs = [];

        col.docs.forEach((doc) => {
          docs.push(doc.data());
        });

        if (onSuccess) onSuccess(docs);
      });
  }

  async getCollectionRT(collection, onSuccess = null, onError = null) {
    await this.realtimeDB.ref(`${collection}`).once('value')
      .catch((error) => {
        console.log(`Error getting collection:${error}`);

        if (onError) onError();
      })
      .then((col) => {
        const docs = [];

        col.forEach((doc) => {
          docs.push(doc.val());
        });

        if (onSuccess) onSuccess(docs);
      });
  }

  setDocument(collection, documentID, data, onSuccess = null) {
    this.firestore.collection(collection).doc(documentID).set(data)
      .catch((error) => {
        console.log(`Error setting document:${error}`);
      })
      .then((result) => {
        if (onSuccess) onSuccess(result);
      });
  }

  setDocumentRT(collection, documentID, data, onSuccess = null) {
    this.realtimeDB.ref(`${collection}/${documentID}`).set(data)
      .catch((error) => {
        console.log(`Error setting document (RTDB):${error}`);
      })
      .then((result) => {
        if (onSuccess) onSuccess(result);
      });
  }

  onCollectionChangeRT(collection, onChange) {
    this.realtimeDB.ref(`${collection}/`).on('value', (snapshot) => {
      onChange(snapshot);
    });
  }

  onDocumentChangeRT(collection, documentID, onChange) {
    this.realtimeDB.ref(`${collection}/${documentID}`).on('value', (snapshot) => {
      onChange(snapshot.val());
    });
  }

  stopOnDocumentChangeRT(collection, documentID) {
    this.realtimeDB.ref(`${collection}/${documentID}`).off('value');
  }

  removeDocument(collection, documentID, onSuccess = null) {
    this.firestore.collection(collection).doc(documentID).delete()
      .catch((error) => {
        console.log(`Error deleting document:${error}`);
      })
      .then((result) => {
        if (onSuccess) onSuccess(result);
      });
  }

  removeDocumentRT(collection, documentID, onSuccess = null) {
    this.realtimeDB.ref(`${collection}/${documentID}`).remove()
      .catch((error) => {
        console.log(`Error deleting documentRT:${error}`);
      })
      .then((result) => {
        if (onSuccess) onSuccess(result);
      });
  }
}
