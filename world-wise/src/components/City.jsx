import styles from './City.module.css';
import flagemojiToPNG from '../../public/flagemojiToPNG';
import { useParams } from 'react-router-dom';

const formatDate = (date) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  }).format(new Date(date));

function City({ cities }) {
  const { id } = useParams();
  console.log(
    `From City: (id: ${id}) ${JSON.stringify(
      cities.reduce(
        (city_acc, city) => (city.id === String(id) ? city : null),
        []
      )
    )}`
  );

  const currentCity = {
    cityName: 'Lisbon',
    emoji: '🇵🇹',
    date: '2027-10-31T15:59:59.138Z',
    notes: 'My favorite city so far!',
  };
  //cities.filter((city) => city.id === id);

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

      <div></div>
    </div>
  );
}

export default City;
