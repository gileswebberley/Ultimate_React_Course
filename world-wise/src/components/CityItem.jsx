import { Link } from 'react-router-dom';
import styles from './CityItem.module.css';
import { flagemojiToPNG } from '../../public/flagemojiToPNG';
import { useCitiesContext } from '../Contexts/CitiesContext';
import formatDate from '../../public/formatDate';

function CityItem({ city }) {
  const { currentCity, deleteCity } = useCitiesContext();
  //city is being passed from CityList during the mapping of cities so it is seemingly more logical to simply pass it as a prop than to send the id and search the CitiesContext in this case
  const { cityName, emoji, date, id, position } = city;

  function handleDeleteCity(e) {
    //to stop the underlying city from being selected as the whole thing is a Link
    e.preventDefault();
    //give users the chance to cancel a deletion by using the global window object
    if (
      window.confirm(
        `Are you sure that you want to delete ${cityName} from your list?`
      )
    ) {
      deleteCity(id);
    }
  }

  return (
    <li>
      {/* Here we are implementing the url based state which we defined in App with the Route with a colon based path (cities/:cityId) and adding the location data as a query which is used by the Map */}
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
        <button className={styles.deleteBtn} onClick={handleDeleteCity}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
