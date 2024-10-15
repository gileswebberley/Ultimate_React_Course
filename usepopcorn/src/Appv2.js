import { useEffect, useState } from 'react';

const tempWatchedData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: 'tt0088763',
    Title: 'Back to the Future',
    Year: '1985',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

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
const OMDbURL = 'http://www.omdbapi.com/?apikey=';
const OMDbKEY = '841c6d87';

export default function App() {
  //here we'll implement some 'loading' feature for the asyncrounous data from an api
  //which we'll utilise in our first useEffect() ps. use throtle in dev-tools to emulate a slow connection
  const [isLoading, setIsLoading] = useState(false);
  //in case loading fails for some reason we'll throw an error and pass it's message in here
  const [isError, setIsError] = useState('');
  //now we'll move the search query up to this level to get it all loading
  const [query, setQuery] = useState('');

  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(tempWatchedData);

  //implement further details being displayed
  const [selctedMovieId, setSelectedMovieId] = useState(null);

  function handleSelectMovie(id) {
    //implement it closing on second click of the same MovieListing
    setSelectedMovieId((selected) => (selected === id ? null : id));
  }

  function handleCloseDetails() {
    setSelectedMovieId(null);
  }

  //passing the movies prop down through the levels of components is called Prop
  // Drilling - this can be avoided by the use of component composition as we are
  //doing here with the NavBar and SearchResultNumber (NavBar no longer needs the
  //movies prop which it was simply passing down to it's child before using this technique)
  //Taking the technique further we end up with a nice component tree view in the App
  //Note that components can also be passed as explicit props (ie not the in-built children)

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
      //now we'll add error handling with a try/catch/finally block and throw an error
      //if the fetch doesn't succeed...
      async function setMoviesEffect() {
        try {
          //we are loading asynchronous data so we'll use our loader functionality
          setIsLoading(true);
          setIsError('');
          //to overcome the problem with res.ok never being evaluated I'm going to try to chain a catch function and throw a new error - didn't work until I threw a TypeError rather than generic Error
          const res = await fetch(`${OMDbURL}${OMDbKEY}&s=${query}`).catch(
            function (err) {
              throw new TypeError(
                'something went wrong when trying to fetch the movies for you'
              );
            }
          );
          //check this has resolved by testing the ok property - no this is wrong..
          // if (!res.ok) {
          //   throw new TypeError(
          //     'something went wrong when trying to fetch the movies for you'
          //   );
          // } //This never runs as fetch throws it's own error
          const data = await res.json();
          //check if there's any results before trying to display them
          if (!data.Search) {
            throw new SyntaxError(
              'Cannot find any movies that match your search'
            );
          }
          setMovies(data.Search);
        } catch (err) {
          // console.log('The name of the ERROR thrown by fetch is: ' + err.name);
          // console.log('The message attached to the Error is:' + err.message);
          setIsError(err.message);
        } finally {
          //and now we've finished waiting so replace the loader with the data presentation or an error message
          setIsLoading(false);
        }
      }
      //don't run if the query is too short
      if (query.length < 3) {
        //I'll leave the last search rather than reset with setMovies([])
        setIsError('');
        return;
      }
      setMoviesEffect();
    },
    //now we are reacting to changes of the state variable 'query' we add it to the dependency array
    [query]
  );

  return (
    <>
      <NavBar>
        <Logo divClass="logo" imageString="🍿" title="usePopcorn" />
        <Search query={query} onSetQuery={setQuery} />
        <SearchResultNumber movies={movies} />
      </NavBar>

      <Main>
        <ToggleBox>
          {/* We now have to add more conditions for loading and error handling */}
          {isLoading && <Loader />}
          {!isLoading && !isError && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {isError && <Error message={isError} />}
        </ToggleBox>
        <ToggleBox>
          {selctedMovieId ? (
            <MovieDetails
              selectedId={selctedMovieId}
              onCloseDetails={handleCloseDetails}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList watched={watched} />
            </>
          )}
        </ToggleBox>
      </Main>
    </>
  );
}

//Slowly creating some reuseable components as we notice similarities in functionality

//A simple button that toggles an isOpen functionality
function ToggleButton({ toggleFunction, toggleVariable }) {
  return (
    <button
      className="btn-toggle"
      onClick={() => toggleFunction((open) => !open)}
    >
      {toggleVariable ? '–' : '+'}
    </button>
  );
}

//The box component that utilises the ToggleButton functionality to show/hide it's children
function ToggleBox({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <ToggleButton toggleFunction={setIsOpen} toggleVariable={isOpen} />
      {/* Notice that we have not stated {children} as we are already in 'js-mode' */}
      {isOpen && children}
    </div>
  );
}

//a very simple loading icon
function Loader() {
  return <p className="loader">Loading...</p>;
}

//and another presentational component to handle any errors
function Error({ message }) {
  return (
    <p className="error">
      <span>OH NO 😯 {message}</span>
    </p>
  );
}

//MAIN WINDOW -------------------------------------------------------------------
function Main({ children }) {
  return <main className="main">{children}</main>;
}

//WATCHED MOVIES -----------------------------------------------------------------

function WatchedList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedListing movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function WatchedListing({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

//MOVIE LISTING -------------------------------------------------------------

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <MovieListing
          movie={movie}
          key={movie.imdbID}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </ul>
  );
}

function MovieListing({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>📆</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, onCloseDetails }) {
  const [currentMovie, setCurrentMovie] = useState({});
  //destructure the movie data
  const {
    Title,
    Year,
    Poster,
    Runtime,
    imdbRating,
    Plot,
    Realeased,
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
        <header>
          <button className="btn-back" onClick={onCloseDetails}>
            &larr;
          </button>
          <img src={Poster} alt={`Poster for ${Title}`} />
          <section>
            <h2>{Title}</h2>
          </section>
          {/* The selected movie imdb ID is {selectedId}{' '}
          {JSON.stringify(currentMovie)} */}
        </header>
      )}
      {isError && <Error message={isError} />}
    </div>
  );
}

//NAVIGATION AREA --------------------------------------------------------
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      {/* this is the example of how to avoid prop drilling by using component composition*/}
      {children}
    </nav>
  );
}

function Logo({ divClass, imageString, title }) {
  return (
    <div className={divClass}>
      <span role="img">{imageString}</span>
      <h1>{title}</h1>
    </div>
  );
}

function SearchResultNumber({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Search({ query, onSetQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onSetQuery(e.target.value)}
    />
  );
}
