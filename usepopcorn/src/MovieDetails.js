import { useState, useEffect } from 'react';
import { OMDbURL, OMDbKEY, Loader, Error } from './App';
import StarRating from './StarRating';

export function MovieDetails({ selectedId, onCloseDetails }) {
  const [currentMovie, setCurrentMovie] = useState({});
  //destructure the movie data
  const {
    Title,
    Year,
    Poster,
    Runtime,
    imdbRating,
    Plot,
    Released,
    Actors,
    Director,
    Genre,
  } = currentMovie;
  //some async functionality...
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');
  //each time this loads we will get the movie details of the selected id
  //this will run on mount due to the empty dependency array remember...
  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setIsLoading(true);
          setIsError('');
          const res = await fetch(`${OMDbURL}${OMDbKEY}&i=${selectedId}`).catch(
            function (err) {
              throw new TypeError(
                'something went wrong when trying to fetch the movies for you'
              );
            }
          );
          //data should always be passable as we have the id from the search
          const data = await res.json();
          setCurrentMovie(data);
        } catch (error) {
          setIsError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      getMovieDetails();
    },
    [selectedId]
  );

  //then return the details or error or loading....
  return (
    <div className="details">
      {isLoading && <Loader />}
      {!isLoading && !isError && (
        <>
          <header>
            <button className="btn-back" onClick={onCloseDetails}>
              &larr;
            </button>
            <img src={Poster} alt={`Poster for ${Title}`} />
            <section className="details-overview">
              <h2>{Title}</h2>
              <p>
                {Released} &bull; {Runtime}
              </p>
              <p>{Genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb Rating
              </p>
            </section>
            {/* The selected movie imdb ID is {selectedId}{' '}
                  {JSON.stringify(currentMovie)} */}
          </header>
          <section>
            <div className="rating">
              <StarRating maxRating={10} colour="#dd910e" size={20} />
            </div>
            <p>
              <em>{Plot}</em>
            </p>
            <p>Starring {Actors}</p>
            <p>Directed by {Director}</p>
          </section>
        </>
      )}
      {isError && <Error message={isError} />}
    </div>
  );
}
