import { useEffect, useState } from 'react';
import { useLocalStorageState } from './useLocalStorageState';
import { MovieDetails } from './MovieDetails';
import { ToggleBox } from './ToggleBox';
import { Loader } from './Loader';
import { Error } from './Error';
import { WatchedList } from './WatchedList';
import { WatchedSummary } from './WatchedSummary';
import { MovieList } from './MovieList';
import { NavBar } from './NavBar';
import { Logo } from './Logo';
import { SearchResultNumber } from './SearchResultNumber';
import { Search } from './Search';
import { useOmdbFetch } from './useOmdbFetch';

/**
 * Tutorial: Most components fit into one of three categories -
 * Stateless (Presentational) - see Logo, MovieListing etc
 * These components have no State variables but instead can recieve and present data via props
 * They tend to be small and reusable
 *
 * Stateful - see WatchedBox
 * These components obviously have state but they can also still be reusable
 *
 * Structural - see Main, NavBar, and App
 * These components are generally for 'pages'/'layouts'/'screens' and are the result of composition (as in the oop idea of composition) to provide structure
 * They can end up being fairly large and tend not to be intended for reuse
 *
 *Component Composition is achieved by using the children property making the parent components more reusable so rather than eg 
 function Main({ movies }) {
  return (
    <main className="main">
      <MovieBox movies={movies} />
      <WatchedBox />
    </main>
  );
}
  we could instead have
  function Main({children }) {
  return (
    <main className="main">
      {children}
    </main>
  );
}
  and then use it like this
  <Main>
    <MovieBox movies={movies} />
    <WatchedBox />
  </Main>
  which saves us having to use prop drilling via the Main component
 */

//Onto section 12 of the course we are going to collect data from an api
//Set these constants outside the component so it isn't recreated on re-render etc
export const OMDbURL = 'http://www.omdbapi.com/?apikey=';
export const OMDbKEY = '841c6d87';

export default function App() {
  //now we'll move the search query up to this level to get it all loading
  const [query, setQuery] = useState('');
  //Now we have made the watched list persistent we pass a function into useState to collect on initial render
  //Version 2, we have created a custom hook for using local storage so we'll try that instead
  const [watched, setWatched] = useLocalStorageState('watchedMoviesList');
  const [movies, isError, isLoading] = useOmdbFetch(query, OMDbKEY);

  //implement further details being displayed
  const [selctedMovieId, setSelectedMovieId] = useState(null);

  function handleSelectMovie(id) {
    //implement it closing on second click of the same MovieListing
    setSelectedMovieId((selected) => (selected === id ? null : id));
  }

  function handleCloseDetails() {
    setSelectedMovieId(null);
  }

  function handleAddWatchedMovie(movie) {
    //check whether it's already in the list and if it is it must have had it's user
    //rating changed to have made it up to this point (it seems a waste to have to
    //check here as well as in the MovieDetails component but I can't work out if
    //there's a more efficient way to do it? Alternative would be to do the working
    //out in handleSelectMovie and pass down those variables instead of the watched state?)
    if (watched.map((w) => w.imdbID).includes(movie.imdbID)) {
      //remove it and readd it, or alter the entry? Alter, works nicely
      setWatched((wArr) =>
        wArr.map((w) =>
          w.imdbID === movie.imdbID ? { ...w, userRating: movie.userRating } : w
        )
      );
    } else {
      setWatched((w) => [...w, movie]);
    }
  }

  function handleDeleteWatched(id) {
    setWatched((wArr) => wArr.filter((w) => w.imdbID !== id));
  }

  /**
   * Let's learn about the useEffect hook to stop infinite loops when collecting the data from an api
   * useEffect does not return any value but instead takes a function and a 'dependency array' which if it is an empty array will only run the function on Mount (ie initial load of the component)
   * The useEffect executes after render phase
   */
  //let's load the results of a search from the OMDb api into the movies state
  //This involves the chaining of then() expressions to deal with the Promises created by asynchronous functions
  // useEffect(function () {
  //   fetch(`${OMDbURL}${OMDbKEY}&s=beautiful`)
  //     .then((res) => res.json())
  //     .then((data) => setMovies(data.Search));
  // }, []);

  //as useEffect cannot return a Promise here is the async version of the above useEffect -----
  //Version 2 this has been extracted into a custom hook....

  //passing the movies prop down through the levels of components is called Prop
  // Drilling - this can be avoided by the use of component composition as we are
  //doing here with the NavBar and SearchResultNumber (NavBar no longer needs the
  //movies prop which it was simply passing down to it's child before using this technique)
  //Taking the technique further we end up with a nice component tree view in the App
  //Note that components can also be passed as explicit props (ie not the in-built children)
  return (
    <>
      <NavBar>
        <Logo divClass="logo" imageString="🍿" title="usePopcorn" />
        <Search query={query} onSetQuery={setQuery} />
        <SearchResultNumber movies={movies} />
      </NavBar>

      <Main>
        <ToggleBox>
          {movies.length === 0 && !isLoading && !isError ? (
            <p className="loader">
              Please hit Enter to search for movies via the OMDb website
            </p>
          ) : (
            ''
          )}
          {/* We now have to add more conditions for loading and error handling */}
          {isLoading && <Loader />}
          {!isLoading && !isError && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {isError && !isLoading && <Error message={isError} />}
        </ToggleBox>
        <ToggleBox>
          {selctedMovieId ? (
            <MovieDetails
              selectedId={selctedMovieId}
              onCloseDetails={handleCloseDetails}
              onAddWatched={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
                onSelectMovie={handleSelectMovie}
              />
            </>
          )}
        </ToggleBox>
      </Main>
    </>
  );
}

//MAIN WINDOW -------------------------------------------------------------------
function Main({ children }) {
  return <main className="main">{children}</main>;
}
