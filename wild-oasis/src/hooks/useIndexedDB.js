import { useCallback, useEffect, useState } from 'react';
import {
  addKeyPathRegister,
  createNewDBObject,
  defaultKeyPath,
  deleteDB,
  getDBEntry,
  initDB,
  setDefaultKeyPath,
  updateDBEntry,
} from '../services/apiIndexedDB';
import { useLocalStorageState } from './useLocalStorageState';

export function useIndexedDB(dbName, storeArray = [], defaultKey = 'keyId') {
  //all of the state to register to
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

  //let's also set the registry if we have passed a store array in (which means we're setting up the stores when opening the connection)
  if (storeArray.length !== 0) {
    storeArray.forEach((store) => {
      addKeyPathRegister(store.name, store.key ?? defaultKey);
    });
  }

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
    if (!db) initialiseDB();
  }, [db, dbName, storeArray]);

  //I'm using the useCallback on these as I believe that stops them being reproduced every time a bit of state is altered however I am still unsure about memoisation tbh.

  //Private function
  const resetAll = useCallback(() => {
    setDb(null);
    setData(null);
    setErrors(null);
    setCurrentObjectIdState(null);
    // currentObjectId = null;
  }, [setCurrentObjectIdState]);

  //This creates a new object and sets the currentObjectId to the value defined. In shared_constants we've set which property will act as the keyPath for the db (eg guestId) however if the user doesn't define a value for this property this function will create a uuid for that property
  const createCurrentObject = useCallback(
    (storeName, data = {}) => {
      setIsDBBusy(true);
      createNewDBObject(storeName, data)
        .then((key) => {
          //   currentObjectId = key;
          setCurrentObjectIdState(key);
        })
        .finally(setIsDBBusy(false));
    },
    [setCurrentObjectIdState]
  );

  //should this change the current object to this id or leave it as a seperate function - just thinking, you might want to get other data whilst working on the current object so it's probably best not - I'll add a move reference function rather than open the state to fiddling with directly. I also use this for getting the current data so that would be making changes that are not required
  const getDataById = useCallback((storeName, objectId) => {
    setIsDBBusy(true);
    getDBEntry(storeName, objectId)
      .then((data) => {
        //setCurrentObjectIdState(objectId);
        setData(data);
      })
      .catch((err) =>
        console.error(
          `Could not get data from ${storeName} with id ${objectId}: ${err}`
        )
      )
      .finally(setIsDBBusy(false));
  }, []);

  //does what it says on the tin I think, I decided to just keep a reference to whatever data (entry) we wanted to work on so that it can look after it's own state if that makes sense
  const getCurrentData = useCallback(
    (storeName) => {
      if (!currentObjectIdState) {
        console.log('No current object set');
        return;
      }
      getDataById(storeName, currentObjectIdState);
    },
    [currentObjectIdState, getDataById]
  );

  const updateDataById = useCallback(
    (storeName, uid, data) => {
      setIsDBBusy(true);
      updateDBEntry(storeName, uid, data)
        .then((data) => getCurrentData(storeName))
        .catch((err) =>
          console.error(
            `Could not update data from ${storeName} with id ${uid}: ${err}`
          )
        )
        .finally(setIsDBBusy(false));
    },
    [getCurrentData]
  );

  const updateCurrentData = useCallback(
    (storeName, data) => {
      if (!currentObjectIdState) return;
      updateDataById(storeName, currentObjectIdState, data);
    },
    [currentObjectIdState, updateDataById]
  );

  //indirect access to change the 'current' entry
  const moveCurrentReference = useCallback(
    (newId) => {
      setCurrentObjectIdState(newId);
    },
    [setCurrentObjectIdState]
  );

  const deleteDatabase = useCallback(
    (dbName) => {
      setIsDBBusy(true);
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
    moveCurrentReference,
    getCurrentData,
    createCurrentObject,
    updateCurrentData,
    deleteDatabase,
  };
}
