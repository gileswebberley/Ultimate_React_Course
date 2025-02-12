import Spinner from '../../ui/Spinner';
import CabinRow from './CabinRow';
import { useCabins } from './useCabins';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import { useSearchParams } from 'react-router-dom';

function CabinTable() {
  //now we'll use react query who's functionality we have extracted into useCabins
  const { isLoading, error, cabins } = useCabins();
  const [searchParams, setSearchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  if (error) return <div>ERROR: {error}</div>;

  const filter = searchParams.get('discount') ?? 'all';

  let filteredCabins;

  switch (filter) {
    case 'all':
      filteredCabins = cabins;
      break;
    case 'no-discount':
      filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
      break;
    case 'with-discount':
      filteredCabins = cabins.filter((cabin) => cabin.discount > 0);
      break;
    default:
      filteredCabins = cabins;
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
