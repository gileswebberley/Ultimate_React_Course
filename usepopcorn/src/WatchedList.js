import { WatchedListing } from './WatchedListing';

//WATCHED MOVIES -----------------------------------------------------------------
export function WatchedList({ watched, onDeleteWatched, onSelectMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedListing
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </ul>
  );
}
