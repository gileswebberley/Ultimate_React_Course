import { useEffect } from 'react';

export function useKey(key, action) {
  //this is a custom hook which looks after executing a function when a given key is pressed
  useEffect(
    function () {
      function callBack(e) {
        //make it a bit more robust by taking care of differences in capitalisation
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action();
        }
      }
      document.addEventListener('keydown', callBack);
      return function () {
        document.removeEventListener('keydown', callBack);
      };
    },
    [key, action]
  );
}
