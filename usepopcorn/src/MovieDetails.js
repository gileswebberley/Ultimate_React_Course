import { useState, useEffect } from 'react';
import { OMDbURL, OMDbKEY } from './App';
import { Error } from './Error';
import { Loader } from './Loader';
import StarRating from './StarRating';

export function MovieDetails({
  selectedId,
  onCloseDetails,
  onAddWatched,
  watched,
}) {
  //bool to indicate if this movie is already on the watchlist
  const checkWatched = watched.map((w) => w.imdbID).includes(selectedId);
  //quickly grab any user rating that has already been assigned to this film
  //a good example of using the 'nullish coalescing operator' (??) and the optional chaining operator (?.) when unsure of accessing properties that may not exist
  // const watchedUserRating = Number(
  //   watched.find((w) => w.imdbID === selectedId)?.userRating ?? 0
  // );
  //Realised that I can place the above in an if statement so it doesn't bother if it's not on the watched list
  const watchedUserRating = checkWatched
    ? Number(watched.find((w) => w.imdbID === selectedId)?.userRating)
    : 0;
  // console.log(`watchedUserRating: ${watchedUserRating}`);
  const [currentMovie, setCurrentMovie] = useState({});
  const [currentRating, setCurrentRating] = useState(0);
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

  function addWatched() {
    //create a new watched movie object to add to the watched state variable in App
    //if it already exists and only the user rating has changed it will be updated rather than added in the App handleAddWatchedMovie function
    const watchedMovie = {
      imdbID: selectedId,
      Title,
      Year,
      Poster,
      imdbRating: Number(imdbRating),
      userRating: currentRating,
      runtime: Number(Runtime.split(' ').at(0)),
    };
    onAddWatched(watchedMovie);
    onCloseDetails();
  }

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
          //if it's already rated then set that here
          setCurrentRating(watchedUserRating);
        }
      }
      getMovieDetails();
    },
    [selectedId, watchedUserRating]
  );

  //we'll add another effect to change the title of the document to the name of the film
  useEffect(
    function () {
      //we wait for the Title dependency to be not undefined and then set it
      document.title = `Movie | ${!Title ? 'Loading...' : Title}`;
      //This is the useEffect Clean-Up function which runs when this component unmounts and before it executes on re-render
      return () => {
        document.title = 'usePopcorn';
        //to give an example of a Closure we'll log the title to the console...
        console.log(
          `Clean Up for title effect has the value ${Title} when it runs because of the concept of Closure`
        );
        //so even though this component has unmounted by the time this function executes,
        //and so Title no longer exists, due to closure it has the value from when
        //it is defined because, I think, it's scope is within the scope of another function.
        //This is an important JavaScript concept which is useful to understand when working within React.
      };
    },
    [Title]
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
            {/* Finding a bug - The selected movie imdb ID is {selectedId}{' '}
                  {JSON.stringify(currentMovie)} */}
          </header>
          <section>
            <div className="rating">
              <StarRating
                maxRating={10}
                currentRating={watchedUserRating}
                colour="#dd910e"
                size={20}
                onSetRating={setCurrentRating}
              />
              {currentRating > 0 &&
                (currentRating !== watchedUserRating || !checkWatched) && (
                  <button className="btn-add" onClick={addWatched}>
                    Add to watched list
                  </button>
                )}
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
