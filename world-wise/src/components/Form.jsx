import { useEffect, useState } from 'react';

import styles from './Form.module.css';
import Button from './Button';
import BackButton from './BackButton';
import { useUrlPosition } from '../hooks/useUrlPosition';
import Spinner from './Spinner';
import { flagemojiToPNG, convertToEmoji } from '../../public/flagemojiToPNG';

const GEO_BASE_URL =
  'https://api.bigdatacloud.net/data/reverse-geocode-client?';

function Form() {
  //TODO - try converting this to a reducer as we have so much related state
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [isLoadingPosition, setIsLoadingPosition] = useState(false);
  const [emoji, setEmoji] = useState();

  const [lat, lng] = useUrlPosition();

  useEffect(
    function () {
      async function fetchCity() {
        try {
          setIsLoadingPosition(true);
          const result = await fetch(
            `${GEO_BASE_URL}latitude=${lat}&longitude=${lng}`
          );
          const data = await result.json();
          //console.log(data);
          setCountry(
            data.countryName.length > 10 ? data.countryCode : data.countryName
          );
          setCityName(
            data.locality === data.city
              ? data.city
              : `${data.locality}(${data.city})`
          );
          setEmoji(convertToEmoji(data.countryCode));
        } catch (error) {
          throw new Error(error.message);
        } finally {
          setIsLoadingPosition(false);
        }
      }
      if (lat && lng) fetchCity();
    },
    [lat, lng]
  );

  if (isLoadingPosition) return <Spinner />;
  return (
    <form className={styles.form}>
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
        <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
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
