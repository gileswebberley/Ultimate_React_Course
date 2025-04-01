import { v4 as createUUID } from 'uuid';
import { iDB } from '../utils/shared_constants';

// let request;
let db = null;
let version = 1;
// let dbSchema = {};
//so we can set this up in the custom hook that uses it
export let defaultKeyPath = iDB.key;
//so we can have the uuid for each store ie {[storeName]: uuid}
export let keyPathRegister = { [iDB.store]: iDB.key };

//example {fullName:'', guestId: undefined, etc}
// export function setSchema(schemaObject) {
//   dbSchema = { ...schemaObject };
// }

//schemaUniqueId is the string name of the property of your schema that you wish to use as the unique id for the object you are storing - eg for our booking we'll probably make it the guestId that is generated when the guest anonymously signs in or a uuid for that booking session, bit I'm trying to keep it flexible
//for our first use of this we'll probably have storeName as 'bookings' then each entry will be a booking{} - {bookingId:uuid, startDate: Date, endDate: Date, cabinId:Number, totalGuests: number, hasBreakfast: Boolean, notes: String}
//I'm wondering whether to make the uuid self generated, perhaps with a create entry function?
export function initDB(dbName, storeNamesArray, schemaUniqueProperty) {
  return new Promise((resolve, reject) => {
    //check that the browser supports it first
    if (!window.indexedDB) reject('indexedDB is not supported in your browser');
    //After developing for a bit and getting to understand how it works it has become apparent that you can simply add properties to existing objects (entries) so don't have to define a schema
    // if (Object.keys(dbSchema).length === 0)
    //   reject('Please set up your db schema before initialising the indexedDB');
    if (!schemaUniqueProperty) schemaUniqueProperty = defaultKeyPath;
    const request = indexedDB.open(dbName, version);
    //if there's no db with the name defined set up yet then this will run before onsuccess - however you can only set up stores when opening a new database, you can't add stores later it seems!
    request.onupgradeneeded = (e) => {
      db = e.target.result;
      storeNamesArray.forEach((storeName) => {
        //if the DB store doesn't exist yet then create it
        if (!doesStoreExist(storeName)) {
          console.log(`Creating ${storeName} DB store...`);
          keyPathRegister[storeName] = schemaUniqueProperty;
          //otherwise safely create the store
          db.createObjectStore(storeName, { keyPath: schemaUniqueProperty });
        }
      });

      db.onerror = () => {
        reject(`Error when creating new DB store`);
      };
    };

    request.onsuccess = (e) => {
      db = e.target.result; // this is request.result in tutorial but like this on mdn guide
      console.log(`DB ${dbName} opened successfully`);
      //   console.log(keyPathRegister);
      resolve(db);
    };

    request.onerror = (e) => {
      reject(`An error occured during initDB: ${e.target.error?.message}`);
    };
  });
}

//I want to be able to remove this from the user's computer when I'm finished with it
export function deleteDB(dbName) {
  if (typeof db !== 'undefined') {
    // db.close();
    const closeRequest = indexedDB.deleteDatabase(dbName);

    closeRequest.onblocked = () => {
      console.error(`${dbName} was blocked from closing`);
    };

    closeRequest.onerror = () => {
      console.error(`There was an error whilst trying to delete ${dbName}`);
    };

    closeRequest.onsuccess = () => {
      console.log(`The database ${dbName} was successfully deleted`);
      db = null;
    };
  } else {
    console.log(`${dbName} does not exist and therefore could not be deleted`);
  }
}

//helper function
function doesStoreExist(storeName) {
  return db?.objectStoreNames?.contains(storeName);
}

export function addToDB(storeName, data) {
  return new Promise((resolve, reject) => {
    if (!doesStoreExist(storeName)) {
      reject(`You have tried to add to ${storeName} which doesn't exist`);
    }
    const transaction = db.transaction([storeName], 'readwrite');

    transaction.onerror = (e) => {
      reject(`Unable to produce a transaction whilst adding to ${storeName}`);
    };

    transaction.oncomplete = (e) => {
      console.log(
        'Adding to db completed: transaction.oncomplete returns:' + e.target
      );
    };

    const store = transaction.objectStore(storeName);
    const request = store.put(data);
    request.onsuccess = (e) => {
      console.log('request.onsuccess returns:' + e.target.result);
      resolve(e.target.result);
    };
  });
}

//let's make a way to make an object to go in a store and create and return the keyPath value for that entry. This actually acts as a safe way to add objects where you don't have to give it a key but you can if it's more appropriate.
export function createNewDBObject(storeName, data = {}) {
  return new Promise((resolve, reject) => {
    if (db === null || !doesStoreExist(storeName)) {
      reject(
        `Invalid call to createNewDBObject: Store '${storeName}' does not exist`
      );
    }
    const key = keyPathRegister[storeName];
    console.log(
      `Key stored is ${key} that matches defaultKeyPath? ${
        key === defaultKeyPath
      } and the data is:`
    );
    console.table(data);
    if (key === defaultKeyPath && !Object.hasOwn(data, key)) {
      //our keyPath is the default and isn't being defined in the data object so create a uuid
      const keyPathValue = createUUID();
      data = { ...data, [key]: keyPathValue };
    }
    //Add the new entry to the store in a self-invoking async function
    (async () => {
      try {
        const success = await addToDB(storeName, data);
        return resolve(success);
      } catch (error) {
        return reject(
          `Could not add the new object to the db store ${storeName}`
        );
      }
    })();
  });
}

export function updateDBEntry(storeName, uid, data) {
  return new Promise((resolve, reject) => {
    if (!doesStoreExist(storeName)) {
      reject(`You have tried to add to ${storeName} which doesn't exist`);
    }
    const store = db
      .transaction([storeName], 'readwrite')
      .objectStore(storeName);

    store.onerror = (e) => {
      reject(`Failed to get store ${storeName}`);
    };

    const request = store.get(uid);

    request.onerror = (e) => {
      reject(`Could not get ${keyPathRegister[storeName]}: ${uid}`);
    };

    request.onsuccess = (e) => {
      const currentData = e.target.result;
      data = { ...currentData, ...data };

      const update = store.put(data);

      update.onerror = (e) => {
        reject(`Failed to update ${keyPathRegister[storeName]}: ${uid}`);
      };

      update.onsuccess = (e) => {
        console.log('Update complete');
        // console.table(e.target.result);
        //the result only holds the key so there's no point returning it I don't think, but it seems wrong just to return true :/
        resolve(e.target.result);
      };
    };
  });
}

export function getDBEntry(storeName, uid) {
  return new Promise((resolve, reject) => {
    if (!doesStoreExist(storeName)) {
      reject(`You have tried to add to ${storeName} which doesn't exist`);
    }
    const store = db.transaction([storeName]).objectStore(storeName);

    store.onerror = (e) => {
      reject(`Failed to get store ${storeName}`);
    };

    const request = store.get(uid);

    request.onerror = (e) => {
      reject(`Could not get ${keyPathRegister[storeName]}: ${uid}`);
    };

    request.onsuccess = (e) => {
      resolve(e.target.result);
    };
  });
}
