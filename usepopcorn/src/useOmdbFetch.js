import { useEffect, useState } from 'react';
/**
 *
 * @param {string} query - query to search DB for
 * @param {string } OMDbAPIKey - unique omdb api key
 * @return {Array<Array<movie>, string, boolean>} movie objects from omdb
 * @return error message if thrown
 * @return whether information is being loaded
 */
export function useOmdbFetch(query, OMDbAPIKey) {
  const OMDbURL = 'http://www.omdbapi.com/?apikey=';
  //here we'll implement some 'loading' feature for the asyncrounous data from an api
  //which we'll utilise in our first useEffect() ps. use throtle in dev-tools to emulate a slow connection
  const [isLoading, setIsLoading] = useState(false);
  //in case loading fails for some reason we'll throw an error and pass it's message in here
  const [isError, setIsError] = useState('');
  const [movies, setMovies] = useState([]);

  useEffect(
    function () {
      //due to the race condition that becomes apparent when using this we use this as a second parameter for the fetch function
      const fetchController = new AbortController();
      //now we'll add error handling with a try/catch/finally block and throw an error
      //if the fetch doesn't succeed...
      async function setMoviesEffect() {
        try {
          //we are loading asynchronous data so we'll use our loader functionality
          setIsLoading(true);
          setIsError('');
          //to overcome the problem with res.ok never being evaluated I'm going to try to chain a catch function and throw a new error so I control the message - didn't work until I threw a TypeError rather than generic Error
          const res = await fetch(`${OMDbURL}${OMDbAPIKey}&s=${query}`, {
            signal: fetchController.signal,
          }).catch(function (err) {
            if (err.name !== 'AbortError') {
              throw new TypeError('unable to fetch the movie list for you');
            }
          });
          //check this has resolved by testing the ok property - no this is wrong..
          // if (!res.ok) {}
          //This never runs as fetch throws it's own error hence the catch chain on fetch

          //because of the abort mechanism this became fragile so added this ternary
          const data = res?.ok ? await res.json() : {};
          //check if there's any results before trying to display them
          if (!data.Search) {
            throw new SyntaxError(
              'Cannot find any movies that match your search'
            );
          }
          //if all has gone well we create the movies list from the api search results
          setMovies(data.Search);
          //and obviously reset any error messages
          setIsError('');
        } catch (err) {
          // console.log('The name of the ERROR thrown by fetch is: ' + err.name);
          // console.log('The message attached to the Error is:' + err.message);
          if (err.name !== 'AbortError') setIsError(err.message);
          setMovies(() => []);
        } finally {
          //and now we've finished waiting so replace the loader with the data presentation or an error message
          setIsLoading(false);
        }
      }
      //don't run if the query is too short
      if (query.length < 2) {
        //I'll leave the last search rather than reset with setMovies([])
        //but then clear up any error messages that still exist from the last search
        setIsError('');
        return;
      }
      setMoviesEffect();
      //This whole process is causing a race condition when typing in a search term
      //let's fix that with a CleanUp function (see AbortController usage above)
      return () => {
        fetchController.abort();
      };
    },
    //now we are reacting to changes of the state variable 'query' we add it to the dependency array
    [query, OMDbAPIKey]
  );
  return [movies, isError, isLoading];
}
