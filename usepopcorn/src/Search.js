import { useEffect, useRef } from 'react';
export function Search({ query, onSetQuery }) {
  //first time using a ref (see notes for details)
  //We create a ref with useRef and then tie it to our element with the ref property
  //Due to the fact they will only be tied together when the DOM is loaded we useEffect
  const searchInput = useRef(null);

  useEffect(
    function () {
      //To make the search bar gain focus on load we would do this
      // searchInput.current.focus();
      //but we want an example of using a key event to give focus so we'll use the add/remove event listener
      function callBack(e) {
        //we're already searching so ignore hitting enter
        if (document.activeElement === searchInput.current) return;
        //otherwise send focus to this search bar element
        if (e.code === 'Enter') {
          searchInput.current.focus();
          onSetQuery('');
        }
      }
      //run it to get focus on load...
      callBack({ code: 'Enter' });
      //and then whenever Enter key is pressed...
      document.addEventListener('keydown', callBack);
      //then use the clean up function so we don't add a new listener repeatedly
      return () => document.removeEventListener('keydown', callBack);
    },
    [onSetQuery]
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onSetQuery(e.target.value)}
      name="search movies input"
      ref={searchInput}
    />
  );
}
