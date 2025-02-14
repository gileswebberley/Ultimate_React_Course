import Spinner from '../../ui/Spinner';
import CabinRow from './CabinRow';
import { useCabins } from './useCabins';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import { useSearchParams } from 'react-router-dom';

//Example of client-side filtering and sorting
function CabinTable() {
  //now we'll use react query who's functionality we have extracted into useCabins
  const { isLoading, error, cabins } = useCabins();
  //sorting and filtering are defined in the url - see the CabinTableOperations component
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  if (error) return <div>ERROR: {error}</div>;

  //SORTING - if no sorting method is selected then sort by most recently created (namely the id)
  const sort = searchParams.get('cabins-sort') ?? 'id';
  let sortedCabins;

  const [sortCat, sortDir] = sort.split('-');
  const directionModifier = sortDir === 'asc' ? 1 : -1;
  //console.log(sortSplit);
  // const sortCat = sortSplit[0];
  // const sortDir = sortSplit[1];
  if (sortCat === 'name') {
    //it's a string comparison
    sortedCabins = cabins.sort(
      (a, b) => directionModifier * a.name.localeCompare(b.name)
    );
  } else {
    //it's numerical comparison
    sortedCabins = cabins.sort(
      (a, b) => directionModifier * (a[sortCat] - b[sortCat])
    );
  }

  //FILTERING
  const filter = searchParams.get('discount') ?? 'all';
  let filteredCabins;

  switch (filter) {
    case 'all':
      filteredCabins = sortedCabins;
      break;
    case 'no-discount':
      filteredCabins = sortedCabins.filter((cabin) => cabin.discount === 0);
      break;
    case 'with-discount':
      filteredCabins = sortedCabins.filter((cabin) => cabin.discount > 0);
      break;
    default:
      filteredCabins = sortedCabins;
  }

  return (
    <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 0.4fr">
      <Table.Header>
        <div></div>
        <div>Cabin</div>
        <div>Capacity</div>
        <div>Price</div>
        <div>Discount</div>
        <div></div>
      </Table.Header>
      <Menus>
        <Table.Body
          data={filteredCabins}
          render={(cabin) => (
            <CabinRow role="row" cabin={cabin} key={cabin.id} />
          )}
        />
      </Menus>
    </Table>
  );
}

export default CabinTable;
