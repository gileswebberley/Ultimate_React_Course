import { useSearchParams } from 'react-router-dom';
import styles from './Map.module.css';

function Map() {
  //to grab the longitude and latitude information from the query string we utilise useSearchParams which is like useState in so much as it returns the current params and a setter function
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  return (
    <div className={styles.mapContainer}>
      Map: lat: {lat} lng: {lng}
    </div>
  );
}

export default Map;
