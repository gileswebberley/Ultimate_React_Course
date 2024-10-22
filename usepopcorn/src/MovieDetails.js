import { useState, useEffect } from 'react';
import { OMDbKEY } from './App';
import { Error } from './Error';
import { Loader } from './Loader';
import StarRating from './StarRating';
import { useMovieDetails } from './useMovieDetails';

export function MovieDetails({
  selectedId,
  onCloseDetails,
  onAddWatched,
  watched,
}) {
  // Loading of details extracted into a custom hook called useMovieDetails
  const [currentMovie, isError, isLoading] = useMovieDetails(
    OMDbKEY,
    selectedId
  );
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

  function handleAddWatched(currentRating, currentReview) {
    //create a new watched movie object to add to the watched state variable in App
    //if it already exists and only the user rating has changed it will be updated rather than added in the App handleAddWatchedMovie function
    const watchedMovie = {
      imdbID: selectedId,
      Title,
      Year,
      Poster,
      imdbRating: Number(imdbRating),
      userRating: currentRating,
      userReview: String(currentReview),
      runtime: Number(Runtime.split(' ').at(0)),
    };
    onAddWatched(watchedMovie);
    onCloseDetails();
  }

  //we'll add another effect to change the title of the document to the name of the film
  useEffect(
    function () {
      //we wait for the Title dependency to be not undefined and then set it
      document.title = `Movie | ${!Title ? 'Loading...' : Title}`;
      //This is the useEffect Clean-Up function which runs when this component unmounts and before it executes on re-render
      return () => {
        document.title = 'usePopcorn';
        //to give an example of a Closure we'll log the title to the console...
        // console.log(
        //   `Clean Up for title effect has the value ${Title} when it runs because of the concept of Closure`
        // );
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
          <MovieDetailsHeader
            onCloseDetails={onCloseDetails}
            Poster={Poster}
            Title={Title}
            Released={Released}
            Runtime={Runtime}
            Genre={Genre}
            imdbRating={imdbRating}
          />
          <section>
            <MovieReview
              selectedId={selectedId}
              watched={watched}
              handleAddWatched={handleAddWatched}
            />
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

function MovieReview({ selectedId, watched, handleAddWatched }) {
  const [currentRating, setCurrentRating] = useState(0);
  const [currentReview, setCurrentReview] = useState('');
  const [editReview, setEditReview] = useState(false);

  //bool to indicate if this movie is already on the watchlist
  const checkWatched = watched.map((w) => w.imdbID).includes(selectedId);
  //quickly grab any user rating that has already been assigned to this film
  //a good example of using the 'nullish coalescing operator' (??) and the optional chaining operator (?.) when unsure of accessing properties that may not exist
  const watchedUserRating = checkWatched
    ? Number(watched.find((w) => w.imdbID === selectedId)?.userRating)
    : 0;
  //going to add the possibility to attach a user review/notes to a watched movie
  const watchedUserReview = checkWatched
    ? watched.find((w) => w.imdbID === selectedId)?.userReview ?? ''
    : '';

  function handleEditReview() {
    setEditReview(true);
  }

  //Hook to set rating and review when movie details have loaded
  useEffect(
    function () {
      //if it's already rated then set that here
      setCurrentRating(watchedUserRating);
      //and if it has a review set that here as well (check that it's defined first)
      setCurrentReview(watchedUserReview);
      if (watchedUserReview === '') {
        setEditReview(true);
      }
    },
    [watchedUserRating, watchedUserReview]
  );

  return (
    <div className="rating">
      <StarRating
        maxRating={10}
        currentRating={watchedUserRating}
        colour="#dd910e"
        size={20}
        onSetRating={setCurrentRating}
      />
      {/* Adding in the review functionality */}
      {editReview ? (
        <textarea
          value={currentReview}
          onChange={(e) => setCurrentReview(e.target.value)}
          name="review field"
          placeholder="Add a short review or notes to this movie"
          cols="20"
          rows="4"
        ></textarea>
      ) : (
        <>
          <p>
            Your review says: <br />
            <em>{watchedUserReview}</em>
          </p>
          <button className="btn-edit" onClick={handleEditReview}>
            🖋️
          </button>
        </>
      )}
      {/* If the rating or review has changed, or it has not yet been added to the watchlist, then show the button to add */}
      {(currentRating > 0 || currentReview) &&
        (currentRating !== watchedUserRating ||
          currentReview !== watchedUserReview ||
          !checkWatched) && (
          <>
            <button
              className="btn-add"
              onClick={() => handleAddWatched(currentRating, currentReview)}
            >
              Add to watched list
            </button>
          </>
        )}
    </div>
  );
}

function MovieDetailsHeader({
  onCloseDetails,
  Poster,
  Title,
  Released,
  Runtime,
  Genre,
  imdbRating,
}) {
  return (
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
    </header>
  );
}
