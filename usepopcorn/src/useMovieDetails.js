import { useState, useEffect } from 'react';

export function useMovieDetails(OMDbKEY, selectedId) {
  const OMDbURL = 'http://www.omdbapi.com/?apikey=';
  //some async functionality...
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');
  const [currentMovie, setCurrentMovie] = useState({});
  //each time this loads we will get the movie details of the selected id
  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setIsLoading(true);
          setIsError('');
          const res = await fetch(`${OMDbURL}${OMDbKEY}&i=${selectedId}`).catch(
            function (err) {
              throw new TypeError('failed to fetch the movie details for you');
            }
          );
          //data should always be passable as we have the id from the search
          const data = await res.json();
          setCurrentMovie(() => data);
        } catch (error) {
          setIsError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      getMovieDetails();
    },
    [selectedId, OMDbKEY]
  );
  return [currentMovie, isError, isLoading];
}
