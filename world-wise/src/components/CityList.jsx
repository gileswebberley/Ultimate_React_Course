import styles from './CityList.module.css';
import Spinner from './Spinner';
import CityItem from './CityItem';
import Message from './Message';
import { useCitiesContext } from '../Contexts/CitiesContext';

function CityList() {
  const { cities, isLoading } = useCitiesContext();
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return <Message message="Add your first city by clicking on the map" />;
  return (
    <ul className={styles.cityList}>
      {cities.map((city, i) => (
        <CityItem key={i} city={city} />
      ))}
    </ul>
  );
}

export default CityList;
