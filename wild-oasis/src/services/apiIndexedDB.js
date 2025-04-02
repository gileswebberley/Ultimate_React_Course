import { v4 as createUUID } from 'uuid';

let db = null;
let version = 1;
//so we can set this up in the custom hook that uses it
export let defaultKeyPath;
export const setDefaultKeyPath = (key) => (defaultKeyPath = key);
//so we can have the uuid for each store ie {[storeName]: uuid}
let keyPathRegister = {};
//this was being exported but it's actually just for internal use
const addKeyPathRegister = (storeName, keyName) => {
  if (
    Object.hasOwn(keyPathRegister, storeName) &&
    keyPathRegister[storeName] !== keyName
  ) {
    //it's already set so we want to change it
    keyPathRegister[storeName] = keyName;
    return;
  } else {
    keyPathRegister = { ...keyPathRegister, [storeName]: keyName };
  }
};

export function getStoreKeyPath(storeName) {
  return new Promise((resolve, reject) => {
    if (!doesStoreExist(storeName)) {
      reject(`You have tried to access ${storeName} which doesn't exist`);
    }
    const store = db.transaction([storeName]).objectStore(storeName);
    store.onerror = (e) => {
      reject(`Failed to get store ${storeName}`);
    };

    store.onsuccess = (e) => {
      resolve(store.keyPath);
    };
  });
}

//helper function
function doesStoreExist(storeName) {
  return db?.objectStoreNames?.contains(storeName);
}

//schemaUniqueId is the string name of the property of your schema that you wish to use as the unique id for the object you are storing - eg for our booking we'll probably make it the guestId that is generated when the guest anonymously signs in or a uuid for that booking session, I'm just trying to keep it flexible
//for our first use of this we'll probably have storeName as 'bookings' then each entry will be a booking{} - {bookingId:uuid, startDate: Date, endDate: Date, cabinId:Number, totalGuests: number, hasBreakfast: Boolean, notes: String}

//let's make it so the stores are sent through as an array of objects that contain the name and key properties eg [{name:'booking', key: 'guestId'}]
export function initDB(dbName, storeArray) {
  return new Promise((resolve, reject) => {
    //check that the browser supports it first
    if (!window.indexedDB)
      reject(
        'indexedDB is not supported in your browser and we need it to make this website work'
      );
    let hasUpgraded = false;
    const request = indexedDB.open(dbName, version);
    //if there's no db with the name defined set up yet then this will run before onsuccess - however you can only set up stores when opening a new database, you can't add stores later it seems!
    request.onupgradeneeded = (e) => {
      db = e.target.result;
      hasUpgraded = true;
      storeArray.forEach((store) => {
        //just trying to make it look after bad calls, if the key property is missing we'll just use the deafult that we have set
        if (!Object.hasOwn(store, 'key')) {
          store.key = defaultKeyPath;
        }
        if (!doesStoreExist(store.name)) {
          //if the DB store doesn't exist yet then create it
          console.log(`Creating ${store.name} DB store...`);
          addKeyPathRegister(store.name, store.key);
          //otherwise safely create the store
          db.createObjectStore(store.name, { keyPath: store.key });
        }
      });

      db.onerror = () => {
        reject(`Error when creating new DB store`);
      };
    };

    request.onsuccess = (e) => {
      db = e.target.result;
      //should we check that if someone has opened an already existing db but tried to add new stores? Let's make a flag that let's us know.
      if (!hasUpgraded) {
        storeArray.forEach((store) => {
          if (!doesStoreExist(store.name)) {
            reject(
              `You have tried to add ${store.name} to ${db.name} when the DB already exists. Try creating a new DB or excluding your storeArray`
            );
          } else if (!keyPathRegister[store.name]) {
            //belt and braces for the keyPathRegister sync
            addKeyPathRegister(store.name, store.key ?? defaultKeyPath);
          }
        });
      }
      console.log(`keyPathRegister is: ${JSON.stringify(keyPathRegister)}`);
      //I don't think I should be passing a reference to the db itself, maybe just resolve the name?
      resolve(db.name);
    };

    request.onerror = (e) => {
      reject(`An error occured during initDB: ${e.target.error?.message}`);
    };
  });
}

//I want to be able to remove this from the user's computer when I'm finished with it
export function deleteDB(dbName) {
  return new Promise((resolve, reject) => {
    //check whether the db we're trying to delete is the currently opened one in which case we must close it so that the deletion isn't blocked
    if (db.name === dbName) {
      db.close();
    }
    const deleteRequest = indexedDB.deleteDatabase(dbName);

    deleteRequest.onblocked = () => {
      reject(`${dbName} was blocked from closing`);
    };

    deleteRequest.onerror = () => {
      reject(`There was an error whilst trying to delete ${dbName}`);
    };

    deleteRequest.onsuccess = () => {
      console.log(`The database ${dbName} was successfully deleted`);
      resolve(true);
    };
  });
}

export function deleteEntry(storeName, uid) {
  return new Promise((resolve, reject) => {
    if (!doesStoreExist(storeName)) {
      reject(`You have tried to access ${storeName} which doesn't exist`);
    }
    const store = db
      .transaction([storeName], 'readwrite')
      .objectStore(storeName);
    store.onerror = (e) => {
      reject(`Failed to get store ${storeName}`);
    };

    const deletion = store.delete(uid);
    deletion.onerror = () => {
      reject(`Could not delete entry with the ${store.keyPath}: ${uid}`);
    };
    deletion.onsuccess = () => {
      resolve(true);
    };
  });
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
        `Adding data through this transaction to ${storeName} has completed`
      );
    };

    const store = transaction.objectStore(storeName);
    const request = store.put(data);
    request.onsuccess = (e) => {
      //resolving here rather than in the oncomplete as this is the keyPath id for the data which we've just added and that information isn't available in oncomplete
      resolve(e.target.result);
    };
  });
}

//let's make a way to make an object to go in a store and create and return the keyPath value for that entry. This actually acts as a safe way to add objects where you don't have to give it a key but you can if it's more appropriate.
export function createNewDBObject(storeName, data = {}) {
  return new Promise((resolve, reject) => {
    if (!doesStoreExist(storeName)) {
      reject(`You have tried to access ${storeName} which doesn't exist`);
    }
    const key = keyPathRegister[storeName];
    if (key === defaultKeyPath && !Object.hasOwn(data, key)) {
      //our keyPath is the default and isn't being defined in the data object so create a uuid
      console.log(`Creating a uuid for the ${key} of the new object`);
      const keyPathValue = createUUID();
      data = { ...data, [key]: keyPathValue };
    }
    //Add the new entry to the store in a self-invoking async function (based on advice found in a tutorial)
    (async () => {
      try {
        const success = await addToDB(storeName, data);
        //resolve with the keyPath value for this data
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
      reject(`You have tried to access ${storeName} which doesn't exist`);
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

export function getEntryByNonKeyValue(storeName, valueName, searchValue) {
  return new Promise((resolve, reject) => {
    if (!doesStoreExist(storeName)) {
      reject(`You have tried to access ${storeName} which doesn't exist`);
    }
    const store = db.transaction([storeName]).objectStore(storeName);
    store.onerror = (e) => {
      reject(`Failed to get store ${storeName}`);
    };

    const request = store.openCursor();
    request.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        if (cursor.value[valueName] === searchValue) {
          resolve(cursor.value);
        } else {
          cursor.continue();
        }
      } else {
        reject(
          `Failed to find an entry with ${valueName} set to ${searchValue}`
        );
      }
    };
  });
}

//get an array of all entries that match the criteria
export function getAllEntriesByNonKeyValue(storeName, valueName, searchValue) {
  return new Promise((resolve, reject) => {
    if (!doesStoreExist(storeName)) {
      reject(`You have tried to access ${storeName} which doesn't exist`);
    }
    const store = db.transaction([storeName]).objectStore(storeName);

    store.onerror = (e) => {
      reject(`Failed to get store ${storeName}`);
    };

    let entries = [];
    const request = store.openCursor();
    request.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        if (cursor.value[valueName] === searchValue) {
          entries.push(cursor.value);
        }
        cursor.continue();
      } else {
        if (entries.length === 0) {
          reject(
            `Failed to find an entry with ${valueName} set to ${searchValue}`
          );
        } else {
          resolve(entries);
        }
      }
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
