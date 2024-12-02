import styles from './City.module.css';
import { flagemojiToPNG } from '../../public/flagemojiToPNG';
import { useParams } from 'react-router-dom';
import { useCitiesContext } from '../Contexts/CitiesContext';
//import { useEffect } from 'react';
import Spinner from './Spinner';
import BackButton from './BackButton';
import { useEffect } from 'react';

const formatDate = (date) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  }).format(new Date(date));

//Without using the ContextAPI we could pass the cities prop to the city and then search according to the id we grab from the path
function City() {
  const { id } = useParams();
  const { currentCity, getCity, isLoading } = useCitiesContext();

  useEffect(
    function () {
      //we have made all of the ids into strings which may be because of this as params are always strings
      if (currentCity.id !== id) getCity(id);
    },
    //The tutorial told us not to include getCity in the dependency array
    [id, currentCity]
  );

  if (isLoading) return <Spinner />;
  //This is the search when not using the ContextAPI but rather passing the cities in as a prop
  // const currentCity = cities.find((city) => city.id === id);
  const { cityName, emoji, date, notes } = currentCity;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>
            <img src={flagemojiToPNG(emoji)} alt="flag" />
          </span>{' '}
          {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <BackButton />
      </div>
    </div>
  );
}

export default City;
