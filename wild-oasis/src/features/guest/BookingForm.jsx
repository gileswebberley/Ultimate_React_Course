import { differenceInDays, parseISO } from 'date-fns';
import Spinner from '../../ui/Spinner';
import { useUser } from '../authentication/useUser';
import { useCabin } from '../cabins/useCabin';
import SlideInY from '../../ui/SlideInY';
import GuestTitleArea from '../../ui/GuestTitleArea';
import CabinSketchHeading from '../../ui/CabinSketchHeading';
import { getDisplayName } from '../../utils/helpers';

function BookingForm() {
  const { isCheckingUser, user } = useUser();
  const { isLoading, error, cabin } = useCabin();

  if (isCheckingUser || isLoading) return <Spinner />;

  console.table(user?.user_metadata);
  console.table(cabin);
  const { fullName, cabinId, guestId, startDate, endDate } =
    user?.user_metadata ?? {};

  //convert the date strings from supabase to Date
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  //   const {
  //     startDate: savedStart,
  //     endDate: savedEnd,
  //     cabinID: savedId,
  //   } = useGuestContext();

  return (
    <SlideInY>
      <GuestTitleArea>
        <CabinSketchHeading as="h1">Just A Few More Details</CabinSketchHeading>
        <CabinSketchHeading as="h3">
          We&#39;re almost there {getDisplayName(fullName)}, we just need a few
          more details so we can confirm your booking for our cabin called &#39;
          {cabin.name}&#39; from
          {' ' + start.toDateString()} for {differenceInDays(end, start)} nights
        </CabinSketchHeading>
      </GuestTitleArea>
      <div>Breakfast?</div>
      <div>How many other guests</div>
      <div>Confirm or reset</div>
    </SlideInY>
  );
}

export default BookingForm;
