import { useCallback, useEffect, useState } from 'react';
import {
  createNewDBObject,
  defaultKeyPath,
  deleteDB,
  deleteEntry,
  getDBEntry,
  getEntryByNonKeyValue,
  getStoreKeyPath,
  initDB,
  setDefaultKeyPath,
  updateDBEntry,
} from '../services/apiIndexedDB';
import { useLocalStorageState } from './useLocalStorageState';
import { flushSync } from 'react-dom';

//IMPORTANT - always include your stores when first setting up the database because you can't add them to a database that already exists and is open
//I'm putting some of the functionality inside Promises and using flushSync as when I first tried using it in my site the current object id was not being set and I could not navigate to another page safely. It's just a matter of putting your navigate() call inside then then() clause of the call (first discovered when trying to createCurrentObject as I submitted a form with navigation in the onsuccess callback) I think I'll just need to do it in the create and update (ie the setters) rather than the 'getters'
export function useIndexedDB(dbName, storeArray = [], defaultKey = 'keyId') {
  //all of the state to register to except db which is for private use in the hook
  //I decided this shouldn't be a reference to the db itself so it is now just the name
  const [db, setDb] = useState(null);
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState(null);
  const [isDBBusy, setIsDBBusy] = useState(true);
  //realised this wouldn't persist so trying to fix that otherwise it's useless - seems to be a solution from my small tests. a reload obviously gets rid of it so I've decided to use a tiny local storage entry
  const [currentObjectIdState, setCurrentObjectIdState] = useLocalStorageState(
    null,
    'currentIDBObject'
  );
  //we want to be able to change the default key but also have it set to something if it's not passed as an argument. This should be called on the first instantiation of the db
  if (
    (!defaultKeyPath || defaultKeyPath === 'keyId') &&
    defaultKey !== defaultKeyPath
  ) {
    setDefaultKeyPath(defaultKey);
  }

  //let's also set the registry if we have passed a store array in (which means we're setting up the stores when opening the connection) - hmm, this is done in the setup of the db, what if someone calls an already existing db with new stores which won't be created? Maybe we should recreate it in this case? No that would lose all of the data already in a store! I think this is mainly for use whilst testing anyway
  //   if (storeArray.length !== 0) {
  //     storeArray.forEach((store) => {
  //       addKeyPathRegister(store.name, store.key ?? defaultKey);
  //     });
  //   }

  //ended up in hell loops when calling this in a useEffect inside the component using it so found a solution by having constants defined in shared_constants when 'using' this custom hook
  useEffect(() => {
    const initialiseDB = () => {
      initDB(dbName, storeArray)
        .then((response) => {
          //   setIsDBBusy(false);
          setDb(response);
        })
        .catch((error) => {
          setErrors(error);
        })
        .finally(() => {
          setIsDBBusy(false);
        });
    };
    if (!db || db !== dbName) initialiseDB();
  }, [db, dbName, storeArray]);

  //I'm using the useCallback on these as I believe that stops them being reproduced every time a bit of state is altered however I am still unsure about memoisation tbh.

  //Private functions
  const resetAll = useCallback(() => {
    setDb(null);
    setData(null);
    setErrors(null);
    setCurrentObjectIdState(null);
  }, [setCurrentObjectIdState]);

  //We don't want these state changes batched as we want isDBBusy to act as a lock flag
  const startConnection = () => {
    console.log('Starting db connection...');
    flushSync(() => {
      setIsDBBusy(true);
      setErrors(null);
    });
  };

  //should this change the current object to this id or leave it as a seperate function - just thinking, you might want to get other data whilst working on the current object so it's probably best not - I'll add a move reference function rather than open the state to fiddling with directly. I also use this for getting the current data so that would be making changes that are not required. Had to put this in a promise because it is used by the update data methods and they also rely on this to set isDBBusy to false!!
  const getDataById = useCallback((storeName, objectId) => {
    startConnection();
    return new Promise((resolve) => {
      getDBEntry(storeName, objectId)
        .then((data) => {
          //setCurrentObjectIdState(objectId);
          flushSync(() => {
            setData(data);
          });
        })
        .catch((err) =>
          setErrors(
            `Could not get data from ${storeName} with id ${objectId}: ${err}`
          )
        )
        .finally(() => {
          setIsDBBusy(false);
          resolve(true);
        });
    });
  }, []);

  //does what it says on the tin I think, I decided to just keep a reference to whatever data (entry) we wanted to work on so that it can look after it's own state if that makes sense. getDataById looks after the isDBBusy state so not needed here I don't think. Also I don't see a use-case where this will need a Promise as I don't think people will be doing any navigating after calling this...I wait to be proved wrong though
  const getCurrentData = useCallback(
    (storeName) => {
      if (!currentObjectIdState) {
        setErrors('No current object set');
        return;
      }
      getDataById(storeName, currentObjectIdState);
    },
    [currentObjectIdState, getDataById]
  );

  const updateDataById = useCallback(
    (storeName, uid, data) => {
      return new Promise((resolve) => {
        startConnection();
        updateDBEntry(storeName, uid, data)
          .then((data) =>
            getDataById(storeName, uid).then(() => {
              //isDBBusy has already been set to false by getDataById
              resolve(true);
            })
          )
          .catch((err) => {
            setErrors(
              `Could not update data from ${storeName} with id ${uid}: ${err}`
            );
            setIsDBBusy(false);
            resolve(false);
          });
      });
    },
    [getDataById]
  );

  const updateCurrentData = useCallback(
    (storeName, data) => {
      return new Promise((resolve) => {
        startConnection();
        if (!currentObjectIdState) {
          setErrors('There is no current object set that can be updated');
          setIsDBBusy(false);
          resolve(false);
        }
        updateDataById(storeName, currentObjectIdState, data).then(() =>
          resolve(true)
        );
      });
    },
    [currentObjectIdState, updateDataById]
  );

  //If you need to find an entry but don't have the value for the keyPath then you can get the first entry that has another property (valueName) with the value of searchValue - eg search for an entry that has cabinId of 12. Do I want to set the current object to this one? I think it makes sense because whatever entry we've selected should be expected to be the one we update etc
  const getByNonKey = useCallback(
    (storeName, valueName, searchValue) => {
      startConnection();
      getEntryByNonKeyValue(storeName, valueName, searchValue)
        .then((data) => {
          setData(data);
          getStoreKeyPath(storeName).then((key) =>
            setCurrentObjectIdState(data[key])
          );
        })
        .catch((err) => setErrors(err))
        .finally(setIsDBBusy(false));
    },
    [setCurrentObjectIdState]
  );

  //This creates a new object and sets the currentObjectId to the value defined. In shared_constants we've set which property will act as the keyPath for the db (eg guestId) however if the user doesn't define a value for this property this function will create a uuid for that property
  const createCurrentObject = useCallback(
    (storeName, data = {}) => {
      return new Promise((resolve) => {
        startConnection();
        createNewDBObject(storeName, data)
          .then((key) => {
            //as soon as I tried using this in my app it's failed to set the current object when navigating, tried the promise.then() idea but to no avail so I'm going to try to force the issue :( Seems to have worked, I'll try to see if the promise is required...yes it is!
            flushSync(() => {
              setCurrentObjectIdState(key);
            });

            getDataById(storeName, key);
          })
          .finally(() => {
            setIsDBBusy(false);
            resolve(true);
          });
      });
    },
    [setCurrentObjectIdState, getDataById]
  );

  const deleteCurrentObject = useCallback(
    (storeName) => {
      startConnection();
      deleteEntry(storeName, currentObjectIdState)
        .then(() => {
          setCurrentObjectIdState(null);
          setData(null);
        })
        .catch((err) => setErrors(err.message))
        .finally(setIsDBBusy(false));
    },
    [currentObjectIdState, setCurrentObjectIdState]
  );

  //indirect access to change the 'current' entry
  const moveCurrentReference = useCallback(
    (newId) => {
      flushSync(() => {
        setCurrentObjectIdState(newId);
      });
    },
    [setCurrentObjectIdState]
  );

  const deleteDatabase = useCallback(
    (dbName) => {
      startConnection();
      deleteDB(dbName)
        .then(() => {
          console.warn(`Database has been deleted permanently`);
          resetAll();
        })
        .finally(setIsDBBusy(false));
    },
    [resetAll]
  );

  return {
    isDBBusy,
    errors,
    data,
    currentObjectIdState,
    getDataById,
    updateDataById,
    getByNonKey,
    moveCurrentReference,
    getCurrentData,
    createCurrentObject,
    updateCurrentData,
    deleteCurrentObject,
    deleteDatabase,
  };
}
