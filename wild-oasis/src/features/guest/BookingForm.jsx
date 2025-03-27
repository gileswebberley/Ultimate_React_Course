import { differenceInDays, parseISO } from 'date-fns';
import Spinner from '../../ui/Spinner';
import { useUser } from '../authentication/useUser';
import { useCabin } from '../cabins/useCabin';
import SlideInY from '../../ui/SlideInY';
import GuestTitleArea from '../../ui/GuestTitleArea';
import CabinSketchHeading from '../../ui/CabinSketchHeading';
import { formatCurrency, getDisplayName } from '../../utils/helpers';
import styled from 'styled-components';
import { useSettings } from '../settings/useSettings';
import { useState } from 'react';
import Checkbox from '../../ui/Checkbox';

const Container = styled.div`
  max-width: 78rem;
  display: grid;
  gap: 3rem;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
  padding: 2.4rem 4rem;
  margin: 1rem 1rem;
  background-color: var(--color-grey-100-alpha);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-xl);
`;

function BookingForm() {
  const { isCheckingUser, user } = useUser();
  const { isLoading: isLoadingCabin, error, cabin } = useCabin();
  const { isLoading, settings } = useSettings();
  const [guests, setGuests] = useState(1);
  const [breakfast, setBreakfast] = useState(false);

  if (isCheckingUser || isLoading || isLoadingCabin) return <Spinner />;

  console.table(user?.user_metadata);
  console.table(cabin);
  const { fullName, cabinId, guestId, startDate, endDate, nationalId } =
    user?.user_metadata ?? {};

  //convert the date strings from supabase to Date
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const stayLength = differenceInDays(end, start);
  //   const {
  //     startDate: savedStart,
  //     endDate: savedEnd,
  //     cabinID: savedId,
  //   } = useGuestContext();

  return (
    <SlideInY>
      <GuestTitleArea>
        <CabinSketchHeading as="h1">
          Almost There {getDisplayName(fullName)}...
        </CabinSketchHeading>
      </GuestTitleArea>
      <Container>
        {/* Pop al of this within a div so that we have the bottom row of our container grid free for the button */}
        <CabinSketchHeading as="h3">
          We just need a few more details so we can confirm your booking for our
          cabin &#39;
          {cabin.name}&#39; from
          {' ' + start.toDateString()} for {stayLength} nights
        </CabinSketchHeading>
        <div>
          <Checkbox
            checked={breakfast}
            onChange={() => setBreakfast((val) => !val)}
            // disabled={isAddingBreakfast}
            id="addBreakfast"
          >
            Would you like to add a delicious breakfast crafted by our chefs to
            your booking for{' '}
            {`${formatCurrency(settings.breakfastPrice * stayLength)} `} per
            person? (you don&#39;t have to make a decision now, you can always
            add it when you arrive)
          </Checkbox>
          <div>How many other guests</div>
        </div>
        <div>Confirm or reset</div>
      </Container>
    </SlideInY>
  );
}

export default BookingForm;
