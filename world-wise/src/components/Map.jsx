import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Map.module.css';

function Map() {
  //To programmatically navigate (eg to go to a 'form completed' page when you submit a form) we can use the useNavigate() method from react=router
  const navigate = useNavigate();
  //to grab the longitude and latitude information from the query string we utilise useSearchParams which is like useState in so much as it returns the current params and a setter function
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  return (
    <div className={styles.mapContainer}>
      <h1>
        Map: lat: {lat} lng: {lng}
      </h1>
      {/* and now we can also set params using the setter function provided */}
      <button
        onClick={() => {
          navigate('form');
        }}
      >
        Go to Form page
      </button>
      <button onClick={() => setSearchParams({ lat: 59, lng: 32 })}>
        Set New Position
      </button>
    </div>
  );
}

export default Map;
