import { useState } from 'react';
import CabinTable from '../features/cabins/CabinTable';
import Heading from '../ui/Heading';
import Row from '../ui/Row';
import Button from '../ui/Button';
import CreateCabinForm from '../features/cabins/CreateCabinForm';

function Cabins() {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All cabins</Heading>
        <p>Filter / Sort</p>
      </Row>
      <Row>
        <CabinTable />
        {!showForm && (
          <Button onClick={() => setShowForm((show) => !show)}>
            Add New Cabin
          </Button>
        )}
        {showForm && <CreateCabinForm closeMe={setShowForm} />}
      </Row>
    </>
  );
}

export default Cabins;
