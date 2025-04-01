import { useCallback, useEffect, useState } from 'react';
import {
  createNewDBObject,
  deleteDB,
  getDBEntry,
  initDB,
  updateDBEntry,
} from '../services/apiIndexedDB';
import { useLocalStorageState } from './useLocalStorageState';

//realised this wouldn't persist so trying to fix that otherwise it's useless - seems to be a solution from my small tests - nope, a reload obviously gets rid of it so I've decided to use a tiny local storage entry instead
// let currentObjectId = null;

export function useIndexedDB(dbName, storeNamesArray, schemaUniqueProperty) {
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

  console.log(`local store: ${currentObjectIdState}`);
  //ended up in hell loops when calling this in a useEffect inside the component using it so found a solution by having constants defined in shared_constants when 'using' this custom hook
  useEffect(() => {
    const initialiseDB = () => {
      initDB(dbName, storeNamesArray, schemaUniqueProperty)
        .then((response) => {
          setIsDBBusy(false);
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
  }, [db, dbName, schemaUniqueProperty, storeNamesArray]);

  //I'm using the useCallback on these as I believe that stops them being reproduced every time a bit of state is altered however I am still unsure about memoisation tbh.

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

  //does what it says on the tin I think, I decided to just keep a reference to whatever data (entry) we wanted to work on so that it can look after it's own state if that makes sense
  const getCurrentData = useCallback(
    (storeName) => {
      if (!currentObjectIdState) {
        console.log('No current object set');
        return;
      }
      setIsDBBusy(true);
      getDBEntry(storeName, currentObjectIdState)
        .then((data) => setData(data))
        .catch((err) =>
          console.error(
            `Could not get data from ${storeName} with id ${currentObjectIdState}: ${err}`
          )
        )
        .finally(setIsDBBusy(false));
    },
    [currentObjectIdState]
  );

  const getDataById = useCallback(
    (storeName, objectId) => {
      setIsDBBusy(true);
      getDBEntry(storeName, objectId)
        .then((data) => {
          setCurrentObjectIdState(objectId);
          setData(data);
        })
        .catch((err) =>
          console.error(
            `Could not get data from ${storeName} with id ${objectId}: ${err}`
          )
        )
        .finally(setIsDBBusy(false));
    },
    [setCurrentObjectIdState]
  );

  const updateCurrentData = useCallback(
    (storeName, data) => {
      if (!currentObjectIdState) return;
      setIsDBBusy(true);
      updateDBEntry(storeName, currentObjectIdState, data)
        .then((data) => getCurrentData(storeName))
        .catch((err) =>
          console.error(
            `Could not update data from ${storeName} with id ${currentObjectIdState}: ${err}`
          )
        )
        .finally(setIsDBBusy(false));
    },
    [currentObjectIdState, getCurrentData]
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
    getCurrentData,
    getDataById,
    createCurrentObject,
    updateCurrentData,
    deleteDatabase,
  };
}
