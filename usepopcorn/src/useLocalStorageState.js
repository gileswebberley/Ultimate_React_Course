import { useState, useEffect } from 'react';

/** This is our first custom hook to make collecting and saving locally stored data reusable */

export function useLocalStorageState(keyName) {
  const [value, setValue] = useState(function () {
    //be aware that I had to run this page with the effect once before this worked so added the try-catch
    let storedList;
    try {
      //catch a SecurityError if thrown by getItem()
      storedList = localStorage.getItem(keyName);
      //if storedList is undefined also throw an error
      if (!storedList) throw new ReferenceError('No Locally Stored Watch List');
    } catch (error) {
      //if there's been an error watched is simply set to an empty array (to avoid errors further down the tree)
      alert(
        `Something went wrong (${error.message}) whilst collecting your ${keyName}, please ensure that local storage is allowed`
      );
      return [];
    }

    return JSON.parse(storedList);
  });

  //OK, at last, let's make this persistent. It would be possible to put these calls to store locally
  //in the add/delete event handlers but of course our state will not be updated at that point due to
  //the asynchronous character of state (remember about stale state etc from earlier) and so we'll put
  //it in an effect that listens for changes to the value
  useEffect(
    function () {
      localStorage.setItem(keyName, JSON.stringify(value));
    },
    [value, keyName]
  );

  return [value, setValue];
}
