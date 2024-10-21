import { useEffect, useRef } from 'react';
export function Search({ query, onSetQuery }) {
  //first time using a ref (see notes for details)
  //We create a ref with useRef and then tie it to our element with the ref property
  //Due to the fact they will only be tied together when the DOM is loaded we useEffect
  const searchInput = useRef(null);

  useEffect(function () {
    searchInput.current.focus();
  });

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
