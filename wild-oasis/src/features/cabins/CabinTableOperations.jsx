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
      <SortBy
        label="Sort"
        sortField="cabins-sort"
        options={[
          { value: 'name-asc', label: 'Name (A-Z)' },
          { value: 'name-desc', label: 'Name (Z-A)' },
          { value: 'regularPrice-asc', label: 'Price (Low-High)' },
          { value: 'regularPrice-desc', label: 'Price (High-Low)' },
          { value: 'maxCapacity-asc', label: 'Capacity (Low-High)' },
          { value: 'maxCapacity-desc', label: 'Capacity (High-Low)' },
          { value: 'discount-asc', label: 'Discount (Low-High)' },
          { value: 'discount-desc', label: 'Discount (High-Low)' },
        ]}
      />
    </TableOperations>
  );
}

export default CabinTableOperations;
