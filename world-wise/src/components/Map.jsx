import { useNavigate } from 'react-router-dom';
import styles from './Map.module.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { useState, useEffect } from 'react';
import { useCitiesContext } from '../Contexts/CitiesContext';
import { flagemojiToPNG } from '../../public/flagemojiToPNG';
import Button from './Button';
import { useUrlPosition } from '../hooks/useUrlPosition';

function Map() {
  //now we have a map we'll get the cities list in so we can place the markers
  const { cities } = useCitiesContext();
  //Let's use our custom hook to grab the position from the url
  const [lat, lng] = useUrlPosition();
  //Now create a position array for use in the Leaflet map
  const [mapPosition, setMapPosition] = useState([30, 10]);
  //So that the current position functionality can be implmented with the MoveToCurrentLocation component down below
  const [mapLoaded, setMapLoaded] = useState(false);

  //When position is defined in the url path we keep it stored until it changes, that way when we go back to the cities view it remains in it's selected position
  useEffect(
    function () {
      if (lat && lng) {
        setMapPosition([lat, lng]);
        if (!mapLoaded) setMapLoaded(true);
      }
    },
    [lat, lng, mapLoaded]
  );

  return (
    <div className={styles.mapContainer}>
      {/* With the current location component implemented this button will take you home when on the cities page ie when no lat/lng are defined */}
      {!lat && !lng && (
        <Button
          type="position"
          onClick={(e) => {
            setMapLoaded((ml) => (ml = false));
          }}
        >
          𖦏
        </Button>
      )}
      {/* The React-Leaflet main component, useMap etc are available to any child components such as our custom CentreMap etc */}
      <MapContainer
        center={mapPosition}
        zoom={5}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city, i) => (
          <Marker position={[city.position.lat, city.position.lng]} key={i}>
            <Popup>
              <span>
                <img src={flagemojiToPNG(city.emoji)} alt="flag emoji" />
              </span>
              <span>
                {city.cityName}
                <br />
                {city.notes}
              </span>
            </Popup>
          </Marker>
        ))}
        {/* Custom child components */}
        <CentreMap position={mapPosition} />
        <DetectClickPosition />
        {
          //to make map move to your current location on load as the load event does not fire in react-leaflet
          !mapLoaded && <MoveToCurrentLocation />
        }
      </MapContainer>
    </div>
  );
}

//We use this component to change the position of the map when the mapPosition changes
function CentreMap({ position }) {
  const ourMap = useMap();
  ourMap.flyTo(position, 10);
  return null;
}

//Now we create a component to use when the map is clicked on which uses more of the react-leaflet library
function DetectClickPosition() {
  //To programmatically navigate (eg to go to a 'form completed' page when you submit a form) we can use the useNavigate() hook from react=router
  const navigate = useNavigate();
  //here is the way to handle clicks via the leaflet interface
  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });

  return null;
}

//a little experiment to get the map to centre on current location when it opens
function MoveToCurrentLocation() {
  //get a reference to the current leaflet map instance
  const map = useMap();
  //function of leaflet that uses geolocation data
  map.locate();
  const ourMap = useMapEvents({
    //event fires when location data is retrieved
    locationfound: (location) => {
      //console.log('Location found');
      ourMap.flyTo(location.latlng, 14);
    },
  });
}

export default Map;
