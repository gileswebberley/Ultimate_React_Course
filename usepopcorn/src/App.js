import { useEffect, useState } from 'react';
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
  //here we'll implement some 'loading' feature for the asyncrounous data from an api
  //which we'll utilise in our first useEffect() ps. use throtle in dev-tools to emulate a slow connection
  const [isLoading, setIsLoading] = useState(false);
  //in case loading fails for some reason we'll throw an error and pass it's message in here
  const [isError, setIsError] = useState('');
  //now we'll move the search query up to this level to get it all loading
  const [query, setQuery] = useState('');

  const [movies, setMovies] = useState([]);
  //Now we have made the watched list persistent we pass a function into useState to collect on initial render
  const [watched, setWatched] = useState(function () {
    //be aware that I had to run this page with the effect once before this worked so added the try-catch
    let storedList;
    try {
      //catch a SecurityError if thrown by getItem()
      storedList = localStorage.getItem('watchedMoviesList');
      //if storedList is undefined also throw an error
      if (!storedList) throw new ReferenceError('No Locally Stored Watch List');
    } catch (error) {
      //if there's been an error watched is simply set to an empty array (to avoid errors further down the tree)
      alert(
        'Something went wrong whilst collecting your watched list, please ensure that local storage is allowed'
      );
      return [];
    }

    return JSON.parse(storedList);
  });
  // const [watched, setWatched] = useState([]);

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

  //OK, at last, let's make this persistent. It would be possible to put these calls to store locally
  //in the add/delete event handlers but of course our state will not be updated at that point due to
  //the asynchronous character of state (remember about stale state etc from earlier) and so we'll put
  //it in an effect that listens for changes to the watched list
  useEffect(
    function () {
      localStorage.setItem('watchedMoviesList', JSON.stringify(watched));
    },
    [watched]
  );

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

  //as useEffect cannot return a Promise here is the async version of the above useEffect
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
          const res = await fetch(`${OMDbURL}${OMDbKEY}&s=${query}`, {
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
    [query]
  );

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
