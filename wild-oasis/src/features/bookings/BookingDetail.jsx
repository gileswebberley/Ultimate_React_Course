import styled from 'styled-components';

import BookingDataBox from './BookingDataBox';
import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import Tag from '../../ui/Tag';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';

import { useMoveBack } from '../../hooks/useMoveBack';
import { useBooking } from './useBooking';
import Spinner from '../../ui/Spinner';
import { HiArrowDownOnSquareStack } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { useCheckOut } from '../check-in-out/useCheckOut';

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { isLoading, booking, error } = useBooking();
  const { checkOut, isCheckingOut } = useCheckOut();
  const navigate = useNavigate();
  //console.table(booking);
  const moveBack = useMoveBack();

  if (isLoading) return <Spinner />;

  const { id: bookingId, status } = booking ?? {};

  //within Tag these are used to dynamically create the colour name eg --color-blue-700
  const statusToTagName = {
    unconfirmed: 'blue',
    'checked-in': 'green',
    'checked-out': 'silver',
  };

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking {bookingId}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace('-', ' ')}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />
      {/* Allow for checking in when unconfirmed and checking out when checked in */}
      <ButtonGroup>
        {status === 'unconfirmed' && (
          <Button
            variation="primary"
            size="medium"
            onClick={() => navigate(`../checkin/${bookingId}`)}
          >
            <p>Check-In</p>
          </Button>
        )}

        {status === 'checked-in' && (
          <Button
            variation="primary"
            size="medium"
            disabled={isCheckingOut}
            onClick={() => checkOut(bookingId)}
          >
            <p>Check-Out</p>
          </Button>
        )}
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
