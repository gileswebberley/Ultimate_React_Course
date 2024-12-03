//Library imports
import { useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { enGB } from 'date-fns/locale';
import { nanoid } from 'nanoid';

//Project imports
import styles from './Form.module.css';
import Button from './Button';
import BackButton from './BackButton';
import Spinner from './Spinner';
import Message from './Message';
import { useCitiesContext } from '../Contexts/CitiesContext';
import { useUrlPosition } from '../hooks/useUrlPosition';
import { flagemojiToPNG, convertToEmoji } from '../../public/flagemojiToPNG';

const GEO_BASE_URL =
  'https://api.bigdatacloud.net/data/reverse-geocode-client?';

//let's try to consolidate all this state with a reducer seeing as it's so related and all used in the submit
const initialState = {
  cityName: '',
  country: '',
  date: new Date(),
  notes: '',
  emoji: '',
  message: '',
  isLoadingPosition: false,
};

function reducer(state, action) {
  switch (action.type) {
    //loading related state
    case 'loadingGeo':
      return { ...state, isLoadingPosition: true, message: '' };

    case 'rejected':
      return { ...state, isLoadingPosition: false, message: action.payload };

    //the reason to put it all together
    case 'submit': {
      const data = action.payload;
      const country =
        data.countryName.length > 10 ? data.countryCode : data.countryName;
      const city =
        data.locality === data.city
          ? data.city
          : `${data.locality} (${data.city})`;
      const emoji = convertToEmoji(data.countryCode);
      return {
        ...state,
        country: country,
        cityName: city,
        emoji: emoji,
        isLoadingPosition: false,
      };
    }
    //event handlers for the form fields
    case 'city/naming':
      return { ...state, cityName: action.payload };

    case 'city/dating':
      return { ...state, date: action.payload };

    case 'city/noting':
      return { ...state, notes: action.payload };

    default:
      throw new RangeError('Form reducer does not recognise the action type');
  }
}

function Form() {
  const [
    { cityName, country, date, notes, emoji, message, isLoadingPosition },
    dispatch,
  ] = useReducer(reducer, initialState);

  //as it's related to managing the city data it's all in the CitiesContext
  const { createCity, isLoading } = useCitiesContext();

  //custom hook for grabbing the lat and lng from the url query string
  const [lat, lng] = useUrlPosition();

  //just for the redirect when the form is submitted
  const navigate = useNavigate();

  //grab the location data from an API based on the lat and lng information
  useEffect(
    function () {
      async function fetchCity() {
        dispatch({ type: 'loadingGeo' });
        try {
          const result = await fetch(
            `${GEO_BASE_URL}latitude=${lat}&longitude=${lng}`
          );
          const data = await result.json();
          //in case user clicks in the sea or something
          if (!data.countryCode)
            throw new TypeError(
              "We can't find any information on where you have clicked, please try clicking somewhere else..."
            );
          //otherwise submit the form through the reducer
          dispatch({ type: 'submit', payload: data });
        } catch (error) {
          dispatch({ type: 'rejected', payload: error.message });
        }
      }
      if (lat && lng) fetchCity();
    },
    [lat, lng]
  );

  //an async function because it calls an async function in citiesContext and we want to wait until it's done before we redirect with the useNavigate object
  async function handleAddCity(e) {
    e.preventDefault();
    //no point saving if it's not a place with a date that you visited
    if (!cityName || !date) return;
    //otherwise build a new city object that has the same format as cities.json
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
      //this is a small package to create uid strings because the City component doesn't manage to search if it's a number (fix from earlier)
      id: nanoid(),
    };
    //Now we call the function that we've just added to CitiesContext
    await createCity(newCity);
    //once it's done we return to the cities page with the useNavigate object
    navigate('/app/cities');
  }

  if (isLoadingPosition) return <Spinner />;
  if (message) return <Message message={message} />;
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ''}`}
      onSubmit={handleAddCity}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) =>
            dispatch({ type: 'city/naming', payload: e.target.value })
          }
          value={cityName}
        />
        <span className={styles.flag}>
          <img src={flagemojiToPNG(emoji)} alt="flag emoji" />
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          locale={enGB}
          dateFormat="dd/MM/yyyy"
          selected={date}
          onChange={(pickerDate) =>
            dispatch({ type: 'city/dating', payload: pickerDate })
          }
          id="date"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) =>
            dispatch({ type: 'city/noting', payload: e.target.value })
          }
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
