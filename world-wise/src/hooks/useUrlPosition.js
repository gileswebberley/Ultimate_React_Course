import { useSearchParams } from 'react-router-dom';

export function useUrlPosition() {
  //to grab the longitude and latitude information from the query string we utilise useSearchParams which is like useState in so much as it returns the current params and a setter function (which we're not using here)
  const [searchParams] = useSearchParams();
  let lat = searchParams.get('lat');
  let lng = searchParams.get('lng');

  return [lat, lng];
}
