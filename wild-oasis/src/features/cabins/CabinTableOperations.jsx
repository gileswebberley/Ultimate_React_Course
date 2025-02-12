import Filter from '../../ui/Filter';
import SortBy from '../../ui/SortBy';
import TableOperations from '../../ui/TableOperations';

function CabinTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="discount"
        options={[
          { value: 'all', title: 'All' },
          { value: 'no-discount', title: 'No Discount' },
          { value: 'with-discount', title: 'With Discount' },
        ]}
      />
      <SortBy />
    </TableOperations>
  );
}

export default CabinTableOperations;
