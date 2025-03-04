import Button from '../../ui/Button';
import { useCheckOut } from './useCheckOut';

function CheckoutButton({ bookingId }) {
  const { isCheckingOut, checkOut } = useCheckOut();
  return (
    <Button
      variation="primary"
      size="small"
      disabled={isCheckingOut}
      onClick={() => checkOut(bookingId)}
    >
      Check Out
    </Button>
  );
}

export default CheckoutButton;
