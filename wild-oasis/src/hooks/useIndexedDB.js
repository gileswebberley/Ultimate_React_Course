import { useCallback, useEffect, useState } from 'react';
import {
  createNewDBObject,
  deleteDB,
  getDBEntry,
  initDB,
  updateDBEntry,
} from '../services/apiIndexedDB';

let currentObjectId = null;

export function useIndexedDB(dbName, storeNamesArray, schemaUniqueProperty) {
  //all of the state to register to
  const [db, setDb] = useState(null);
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState(null);
  const [isDBBusy, setIsDBBusy] = useState(true);
  //   const [currentObjectId, setCurrentObjectId] = useState(null);

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
    // setCurrentObjectId(null);
    currentObjectId = null;
  }, []);

  //This creates a new object and sets the currentObjectId to the value defined. In shared_constants we've set which property will act as the keyPath for the db (eg guestId) however if the user doesn't define a value for this property this function will create a uuid for that property
  const createCurrentObject = useCallback((storeName, data = {}) => {
    setIsDBBusy(true);
    createNewDBObject(storeName, data)
      .then((key) => (currentObjectId = key))
      .finally(setIsDBBusy(false));
  }, []);

  //does what it says on the tin I think, I decided to just keep a reference to whatever data (entry) we wanted to work on so that it can look after it's own state if that makes sense
  const getCurrentData = useCallback(
    (storeName) => {
      if (!currentObjectId) {
        console.log('No current object set');
        return;
      }
      setIsDBBusy(true);
      getDBEntry(storeName, currentObjectId)
        .then((data) => setData(data))
        .catch((err) =>
          console.error(
            `Could not get data from ${storeName} with id ${currentObjectId}: ${err}`
          )
        )
        .finally(setIsDBBusy(false));
    },
    [currentObjectId]
  );

  const getDataById = useCallback((storeName, objectId) => {
    setIsDBBusy(true);
    getDBEntry(storeName, objectId)
      .then((data) => setData(data))
      .catch((err) =>
        console.error(
          `Could not get data from ${storeName} with id ${objectId}: ${err}`
        )
      )
      .finally(setIsDBBusy(false));
  }, []);

  const updateCurrentData = useCallback(
    (storeName, data) => {
      if (!currentObjectId) return;
      setIsDBBusy(true);
      updateDBEntry(storeName, currentObjectId, data)
        .then((data) => getCurrentData(storeName))
        .catch((err) =>
          console.error(
            `Could not update data from ${storeName} with id ${currentObjectId}: ${err}`
          )
        )
        .finally(setIsDBBusy(false));
    },
    [currentObjectId, getCurrentData]
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
    currentObjectId,
    getCurrentData,
    getDataById,
    createCurrentObject,
    updateCurrentData,
    deleteDB,
  };
}
