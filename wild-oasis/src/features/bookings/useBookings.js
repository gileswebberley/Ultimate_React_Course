import { useQuery } from '@tanstack/react-query';
import { getBookings } from '../../services/apiBookings';
import { useSearchParams } from 'react-router-dom';
//implementing our api-side filtering and sorting unlike the client side approach used in the CabinsTable
export function useBookings(
  filterField = 'status',
  defaultSort = 'startDate-desc'
) {
  const [searchParams] = useSearchParams();

  //FILTERING
  const filterValue = searchParams.get(filterField);
  const filter =
    !filterValue || filterValue === 'all'
      ? null
      : { field: filterField, value: filterValue };
  //if we were wanting to have, for example, the filterField set to price and only return those bookings that were more expensive than a filterValue of 5000 we could also pass in a 'method' as part of the object (using the name of the supabase query function which at the moment is simply eq(field, value)) and set it to gte(filterField,filterValue). Then in the apiBookings.getBookings we would set the query by having - query = query[method ? filter.method : 'eq'](filter.field, filter.value);

  //SORTING
  const sortByRaw = searchParams.get('sortBy') || null;
  let sortBy = null;
  if (sortByRaw) {
    const [sortField, sortDir] = sortByRaw.split('-');
    sortBy = { field: sortField, direction: sortDir };
  }
  //we are now returning the count as well as the data from getBookings so we destructure that in here
  const {
    isLoading,
    data: { data: bookings, count } = {},
    error,
  } = useQuery({
    queryKey: ['bookings', filter, sortByRaw], //this will now execute the associated queryFn whenever the filter variable's value changes (in this case when another filter button is pressed
    queryFn: () => getBookings({ filter, sortBy }), //remember that the queryfn can only have one argument so we have to put them both in an object
  });

  return { isLoading, bookings, count, error };
}
