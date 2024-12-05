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
  //Now create a position array for use in the Leaflet map, a default value is neccessary for the first render
  const [mapPosition, setMapPosition] = useState([30, 10]);
  //Move to geo-located position or currently selected city when loading and zoom out slightly when moving between City view and CitiesList using the MoveToCurrentLocation component down below - true excludes the component, false includes it and it's functionality
  const [mapLoaded, setMapLoaded] = useState(false);
  //Functionality to go to geo-located position when clicking the button
  const [goToGeoPosition, setGoToGeoPosition] = useState(false);

  //When position is defined in the url path we keep it stored in mapPosition until it changes, that way when we go back to the cities view it remains in it's selected position
  useEffect(
    function () {
      if (lat && lng) {
        setMapPosition([lat, lng]);
        //we have selected a city and so CentreMap will do it's thing on this render so exclude MoveToCurrentLocation...
        setMapLoaded(true);
        //...and reset goToGeoPosition in case the current location button has been clicked and so exclude the MoveHome component
        setGoToGeoPosition(false);
      } else {
        //lat and lng have changed and forced a re-render or it is the first render when they have not yet been defined by a city being selected and so we want the automatic functionality of MoveToCurrentLocation to execute - this flag defines whether it's included
        setMapLoaded(false);
      }
    },
    [lat, lng]
  );

  return (
    <div className={styles.mapContainer}>
      {/* With the current location component implemented this button will take you home when on the cities page ie when no lat/lng are defined
      TODO [make this work] - the MoveToCurrentLocation and the new MoveHome components were clashing on re-render and so we setMapLoaded to true to exclude the former and toggle the GeoPosition to true to include the latter
      */}
      <Button
        type="position"
        onClick={(e) => {
          setMapLoaded(true);
          setGoToGeoPosition(true);
        }}
      >
        𖦏
      </Button>
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
        {
          //Produce a marker at the position of all saved cities with a pop-up that holds some of the city's information
          cities.map((city, i) => (
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
          ))
        }
        {/* Custom child components
          CentreMap moves the map to the currently selected city. It will only render/re-render when the mapPosition prop changes due to that being one of the rules of the render pipeline
          DetectClickPosition is essentially an event handler that uses the leaflet API version of click handling, this passes a position to the handler which triggers the app to navigate to the form component with this position data carried in the url quert string
        */}
        <CentreMap position={mapPosition} />
        <DetectClickPosition />
        {
          //to make map move to your current location or selected city on load as the load event does not fire in react-leaflet
          !mapLoaded && !goToGeoPosition && <MoveToCurrentLocation />
        }
        {
          //this is the component that implements the go to current location when the button is clicked (it makes goToGeoLocation = true, then it becomes false when another city from the list is selected ie the lat & lng variables have a value and the useEffect hook executes)
          goToGeoPosition && <MoveHome />
        }
      </MapContainer>
    </div>
  );
}

//Small component for moving to your current location when the button is pressed
function MoveHome() {
  const map = useMap();
  //function of leaflet that uses geolocation data
  map.locate();
  useMapEvents({
    //event fires when location data is retrieved - flyTo(position-object, zoom-level)
    locationfound: (location) => {
      map.flyTo(location.latlng, 14);
    },
  });
}
//a little experiment to get the map to centre on current location or currentCity when it opens and to zoom out a bit when you go back from City view to CityList
function MoveToCurrentLocation() {
  //check we don't have a currentCity selected and if not go to current location on load
  const { currentCity } = useCitiesContext();
  //get a reference to the current leaflet map instance
  const map = useMap();
  //function of leaflet that uses geolocation data
  map.locate();
  //NOTE - the load event does not get triggered for some reason
  useMapEvents({
    //event fires when location data is retrieved
    locationfound: (location) => {
      if (!currentCity.position) map.flyTo(location.latlng, 14);
      else map.flyTo([currentCity.position.lat, currentCity.position.lng], 10);
    },
  });
}

//We use this component to change the position of the map when the mapPosition changes
function CentreMap({ position }) {
  const ourMap = useMap();
  ourMap.flyTo(position, 14);
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

export default Map;
