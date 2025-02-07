import CabinTable from '../features/cabins/CabinTable';
import Heading from '../ui/Heading';
import Row from '../ui/Row';
import AddCabinModal from '../features/cabins/AddCabinModal';

function Cabins() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All cabins</Heading>
        <p>Filter / Sort</p>
      </Row>
      <Row>
        <CabinTable />
        <AddCabinModal />
      </Row>
    </>
  );
}

export default Cabins;
