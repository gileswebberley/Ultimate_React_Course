import styles from './CountriesList.module.css';
import Spinner from './Spinner';
import CountryItem from './CountryItem';
import Message from './Message';
import { useCitiesContext } from '../Contexts/CitiesContext';

function CountriesList() {
  const { cities, isLoading } = useCitiesContext();
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return <Message message="Add your first country by clicking on the map" />;
  //We need to loop through the cities array to produce a clean array of countries without any duplication.
  const countries = cities.reduce((acc_arr, city) => {
    if (acc_arr.map((city) => city.country).includes(city.country)) {
      return acc_arr;
    } else {
      return [...acc_arr, { country: city.country, emoji: city.emoji }];
    }
  }, []);
  return (
    <ul className={styles.countriesList}>
      {countries.map((country, i) => (
        <CountryItem key={i} country={country} />
      ))}
    </ul>
  );
}

export default CountriesList;
