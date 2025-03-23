import styled from 'styled-components';
import Empty from '../../ui/Empty';
import Spinner from '../../ui/Spinner';
import CabinDetailsBox from '../cabins/CabinDetailsBox';
import { useCabins } from '../cabins/useCabins';
import { useCabinFilters } from '../cabins/useCabinFilters';
import Heading from '../../ui/Heading';
import CabinTableOperations from '../cabins/CabinTableOperations';
import CabinSelectSort from './CabinSelectSort';

const StyledCabinSelect = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 3rem;
  padding: 1.5rem 0;
`;

function CabinSelect() {
  const { isLoading, cabins, error, count } = useCabins();
  let paginationCount = count;
  //sorting and filtering are defined in the url - see the CabinTableOperations component
  // const [searchParams] = useSearchParams();
  let { filteredCabins } = useCabinFilters(cabins ?? {});

  if (isLoading) return <Spinner />;
  if (error) return <div>ERROR: {error}</div>;
  if (cabins.length === 0) return <Empty resource="Cabins" />;

  return (
    <>
      <Heading as="h1">Our Cabins</Heading>
      {/* <CabinTableOperations /> */}
      <CabinSelectSort />
      <StyledCabinSelect>
        {filteredCabins.map((cabin) => (
          <CabinDetailsBox cabin={cabin} key={cabin.id} />
        ))}
      </StyledCabinSelect>
    </>
  );
}

export default CabinSelect;
