import SortBy from '../../ui/SortBy';
import Filter from '../../ui/Filter';
import TableOperations from '../../ui/TableOperations';

function BookingTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="status"
        options={[
          { value: 'all', label: 'All' },
          { value: 'checked-out', label: 'Checked out' },
          { value: 'checked-in', label: 'Checked in' },
          { value: 'unconfirmed', label: 'Unconfirmed' },
        ]}
      />

      <SortBy
        sortField="sortBy"
        label="Sort"
        options={[
          { value: 'startDate-desc', label: 'Sort by date (later-soon)' },
          { value: 'startDate-asc', label: 'Sort by date (soon-later)' },
          {
            value: 'totalPrice-desc',
            label: 'Sort by amount (high-low)',
          },
          { value: 'totalPrice-asc', label: 'Sort by amount (low-high)' },
        ]}
      />
    </TableOperations>
  );
}

export default BookingTableOperations;
