import { useState } from 'react';

const tempMovieData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt0133093',
    Title: 'The Matrix',
    Year: '1999',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt6751668',
    Title: 'Parasite',
    Year: '2019',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
  },
];

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

export default function App() {
  const [movies, setMovies] = useState(tempMovieData);
  //passing the movies prop down through the levels of components is called Prop
  // Drilling - this can be avoided by the use of component composition as we are
  //doing here with the NavBar and SearchResultNumber (NavBar no longer needs the
  //movies prop which it was simply passing down to it's child before using this technique)
  return (
    <>
      <NavBar>
        <SearchResultNumber movies={movies} />
      </NavBar>
      <Main>
        <MovieBox movies={movies} />
        <WatchedBox />
      </Main>
    </>
  );
}

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

//MAIN WINDOW -------------------------------------------------------------------
function Main({ children }) {
  return <main className="main">{children}</main>;
}

//WATCHED MOVIES -----------------------------------------------------------------
function WatchedBox() {
  const [isOpen2, setIsOpen2] = useState(true);
  const [watched, setWatched] = useState(tempWatchedData);

  return (
    <div className="box">
      <ToggleButton toggleFunction={setIsOpen2} toggleVariable={isOpen2} />
      {isOpen2 && (
        <>
          <WatchedSummary watched={watched} />
          <WatchedList watched={watched} />
        </>
      )}
    </div>
  );
}

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
function MovieBox({ movies }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <ToggleButton toggleFunction={setIsOpen1} toggleVariable={isOpen1} />
      {isOpen1 && <MovieList movies={movies} />}
    </div>
  );
}

function MovieList({ movies }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <MovieListing movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function MovieListing({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

//NAVIGATION AREA --------------------------------------------------------
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo divClass="logo" imageString="🍿" title="usePopcorn" />
      <Search />
      {/*
      this is a example of how to avoid prop drilling by using component composition
      <SearchResultNumber movies={movies} /> */}
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

function Search() {
  const [query, setQuery] = useState('');
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
