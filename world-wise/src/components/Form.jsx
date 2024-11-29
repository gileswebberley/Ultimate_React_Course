import { useEffect, useState } from 'react';

import styles from './Form.module.css';
import Button from './Button';
import BackButton from './BackButton';
import { useUrlPosition } from '../hooks/useUrlPosition';
import Spinner from './Spinner';
import { flagemojiToPNG, convertToEmoji } from '../../public/flagemojiToPNG';
import Message from './Message';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { enGB } from 'date-fns/locale';
import { nanoid } from 'nanoid';
import { useCitiesContext } from '../Contexts/CitiesContext';
import { useNavigate } from 'react-router-dom';

const GEO_BASE_URL =
  'https://api.bigdatacloud.net/data/reverse-geocode-client?';

function Form() {
  //TODO - try converting this to a reducer as we have so much related state
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [emoji, setEmoji] = useState();
  const { createCity, isLoading } = useCitiesContext();
  //data loading related state
  const [message, setMessage] = useState('');
  const [isLoadingPosition, setIsLoadingPosition] = useState(false);
  const navigate = useNavigate();
  //custom hook for grabbing the lat and lng from the url query string
  const [lat, lng] = useUrlPosition();

  //grab the location data from an API based on the lat and lng information
  useEffect(
    function () {
      async function fetchCity() {
        try {
          setIsLoadingPosition(true);
          setMessage('');
          const result = await fetch(
            `${GEO_BASE_URL}latitude=${lat}&longitude=${lng}`
          );
          const data = await result.json();
          //in case user clicks in the sea or something
          if (!data.countryCode)
            throw new TypeError(
              "We can't find any information on where you have clicked, please try clicking somewhere else..."
            );
          //console.log(data);
          setCountry(
            data.countryName.length > 10 ? data.countryCode : data.countryName
          );
          setCityName(
            data.locality === data.city
              ? data.city
              : `${data.locality} (${data.city})`
          );
          setEmoji(convertToEmoji(data.countryCode));
        } catch (error) {
          if (error.name === 'TypeError') setMessage(error.message);

          // throw new Error(error.message);
        } finally {
          setIsLoadingPosition(false);
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
          onChange={(e) => setCityName(e.target.value)}
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
          onChange={(pickerDate) => setDate(pickerDate)}
          id="date"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
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
