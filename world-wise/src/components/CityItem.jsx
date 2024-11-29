import { Link } from 'react-router-dom';
import styles from './CityItem.module.css';
import { flagemojiToPNG } from '../../public/flagemojiToPNG';
import { useCitiesContext } from '../Contexts/CitiesContext';
import formatDate from '../../public/formatDate';

function CityItem({ city }) {
  const { currentCity } = useCitiesContext();
  const { cityName, emoji, date, id, position } = city;
  return (
    <li>
      {/* Here we are implementing the url based state which we defined in App with the Route with a colon based path (cities/:cityId) */}
      <Link
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles['cityItem--active'] : ''
        }`}
        to={`${String(id)}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>
          <img src={flagemojiToPNG(emoji)} alt="flag" />
        </span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn}>&times;</button>
      </Link>
    </li>
  );
}

export default CityItem;
