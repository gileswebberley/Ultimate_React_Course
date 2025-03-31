import { v4 as createUUID } from 'uuid';

// let request;
let db = null;
let version = 1;
let dbSchema = {};
const defaultKeyPath = 'entryUUID';
//so we can have the uuid for each store ie {[storeName]: uuid}
let keyPathRegister = {};

//example {fullName:'', guestId: undefined, etc}
export function setSchema(schemaObject) {
  dbSchema = { ...schemaObject };
}

//let's make a way to make an object to go in a store and create and return the keyPath value for that entry
export function createNewDBObject(storeName, data = {}) {
  return new Promise((resolve, reject) => {
    if (db === null || !doesStoreExist(storeName)) {
      reject(
        `Invalid call to createNewDBObject: Store '${storeName}' does not exist`
      );
    }
    const key = keyPathRegister[storeName];
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

//schemaUniqueId is the string name of the property of your schema that you wish to use as the unique id for the object you are storing - eg for our booking we'll probably make it the guestId that is generated when the guest anonymously signs in or a uuid for that booking session, bit I'm trying to keep it flexible
//for our first use of this we'll probably have storeName as 'bookings' then each entry will be a booking{} - {bookingId:uuid, startDate: Date, endDate: Date, cabinId:Number, totalGuests: number, hasBreakfast: Boolean, notes: String}
//I'm wondering whether to make the uuid self generated, perhaps with a create entry function?
export function initDB(storeName, schemaUniqueProperty = defaultKeyPath) {
  return new Promise((resolve, reject) => {
    //check that the browser supports it first
    if (!window.indexedDB) reject('indexedDB is not supported in your browser');
    // if (Object.keys(dbSchema).length === 0)
    //   reject('Please set up your db schema before initialising the indexedDB');
    const request = indexedDB.open('localDB', version);
    //if this is new it will call the onupgradeneeded event where you set up the store
    request.onupgradeneeded = (e) => {
      db = e.target.result;
      //if the DB store doesn't exist yet then create it
      if (!doesStoreExist(storeName)) {
        console.log(`Creating ${storeName} DB store...`);
        keyPathRegister[storeName] = schemaUniqueProperty;
        //we don't want to set the keyPath to a property that doesn't exist in our schema
        // if (!Object.hasOwn(dbSchema, schemaUniqueProperty))
        //   reject(
        //     `Your schema does not have the ${schemaUniqueProperty} property defined`
        //   );
        //otherwise safely create the store
        db.createObjectStore(storeName, { keyPath: schemaUniqueProperty });
      }

      db.onerror = () => {
        reject(`Error when creating new DB store`);
      };
    };

    request.onsuccess = (e) => {
      db = e.target.result; // this is request.result in tutorial but like this on mdn guide
      //we can use this to set the isLoading state in useIndexedDB when we call this in a try/catch I think ie try{setIsLoading(true); const success = await initDB(...); setIsLoading(!success);}catch(e){setIsError(e); setIsLoading(false);}
      resolve(true);
    };

    request.onerror = (e) => {
      reject(`An error occured during initDB: ${e.target.error?.message}`);
    };
  });
}

function doesStoreExist(storeName) {
  return db.objectStoreNames.contains(storeName);
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
      console.log('Adding to db completed');
    };

    const store = transaction.objectStore(storeName);
    const request = store.put(data);
    request.onsuccess = (e) => {
      resolve(e.target.result);
    };
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
        resolve(e.target);
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
