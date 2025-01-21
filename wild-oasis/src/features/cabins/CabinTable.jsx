import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { getCabins } from '../../services/apiCabins';
import Spinner from '../../ui/Spinner';
import CabinRow from './CabinRow';

const Table = styled.div`
  border: 1px solid var(--color-grey-200);

  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

const TableHeader = styled.header`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;

  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
  padding: 1.6rem 2.4rem;
`;

function CabinTable() {
  //now we'll use react query
  //pass in the unique query key as an array which identifies this data, and the query function which does the actual fetching but must return a promise (as in any async function). This returns a lot of isFunctions along with the status
  const {
    isLoading,
    data: cabins,
    error,
  } = useQuery({
    queryKey: ['cabins'],
    queryFn: getCabins,
  });

  if (isLoading) return <Spinner />;

  if (error) return <div>ERROR: {error}</div>;

  return (
    <Table role="table">
      <TableHeader role="rowheader">
        <div></div>
        <div>Cabin</div>
        <div>Capacity</div>
        <div>Price</div>
        <div>Discount</div>
        <div></div>
      </TableHeader>
      {cabins.map((cabin) => (
        <CabinRow role="row" cabin={cabin} key={cabin.id} />
      ))}
    </Table>
  );
}

export default CabinTable;
