import styled from 'styled-components';
import BookingDataBox from '../../features/bookings/BookingDataBox';

import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';

import { useMoveBack } from '../../hooks/useMoveBack';
import { useBooking } from '../bookings/useBooking';
import Spinner from '../../ui/Spinner';
import { useEffect, useState } from 'react';
import Checkbox from '../../ui/Checkbox';
import { formatCurrency } from '../../utils/helpers';
import { useCheckIn } from './useCheckIn';

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  //the user must confirm that payment has been received before checking in
  const [isPaid, setIsPaid] = useState(false);
  const [lastMinuteBreakfast, setLastMinuteBreakfast] = useState(false);
  const { isLoading, booking } = useBooking();
  const { isCheckingIn, checkIn } = useCheckIn();
  useEffect(() => {
    setIsPaid(booking?.isPaid ?? false);
  }, [booking]);

  const moveBack = useMoveBack();

  if (isLoading || isCheckingIn) return <Spinner />;
  // console.log(isPaid);

  const {
    id: bookingId,
    isPaid: bookingPaid,
    guests,
    totalPrice,
    cabinPrice,
    numGuests,
    hasBreakfast,
    numNights,
  } = booking;

  function handleAddBreakfast() {}

  function handleCheckin() {
    if (isPaid) checkIn(bookingId);
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <Box>
        <Checkbox
          checked={isPaid}
          onChange={() => setIsPaid((confirm) => !confirm)}
          disabled={booking?.isPaid ?? false}
          id="confirm-paid"
        >
          I confirm that {guests.fullName} has paid {formatCurrency(totalPrice)}{' '}
          in full
        </Checkbox>
      </Box>

      <ButtonGroup>
        {isPaid && (
          <Button disabled={!isPaid} onClick={handleCheckin}>
            Complete check-in
          </Button>
        )}
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
