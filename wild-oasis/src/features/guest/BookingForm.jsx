import { differenceInDays, format, parseISO } from 'date-fns';
import Spinner from '../../ui/Spinner';
import { useUser } from '../authentication/useUser';
import { useCabin } from '../cabins/useCabin';
import SlideInY from '../../ui/SlideInY';
import GuestTitleArea from '../../ui/GuestTitleArea';
import CabinSketchHeading from '../../ui/CabinSketchHeading';
import { formatCurrency, getDisplayName } from '../../utils/helpers';
import styled from 'styled-components';
import { useSettings } from '../settings/useSettings';
import { useEffect, useState } from 'react';
import Checkbox from '../../ui/Checkbox';
import SimpleFormRow from '../../ui/SimpleFormRow';
import Input from '../../ui/Input';
import Form from '../../ui/Form';
import { bp_sizes } from '../../styles/breakpoints';
import GuestContainer from '../../ui/GuestContainer';
import Range from '../../ui/Range';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import FormRow from '../../ui/FormRow';
import Textarea from '../../ui/Textarea';
import { useAddDetailsToGuest } from './useAddDetailsToGuest';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Container = styled(GuestContainer)`
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
`;

const CheckboxRow = styled(SimpleFormRow)`
  grid-template-columns: 1fr !important;
  /* override the responsive behaviour */
  @media ${bp_sizes.sm} {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
`;

const NoErrorRow = styled(SimpleFormRow)`
  grid-template-columns: 0.5fr 0.5fr;
  @media ${bp_sizes.sm} {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }
`;

function BookingForm() {
  const { isCheckingUser, user, isAuthenticated, isAnonymous } = useUser();
  const { isLoading: isLoadingCabin, error, cabin } = useCabin();
  const { isLoading, settings } = useSettings();
  const { isUpdatingGuest, updateGuest } = useAddDetailsToGuest();

  //Controlled elements
  const [guests, setGuests] = useState(0);
  const [breakfast, setBreakfast] = useState(false);
  const [natId, setNatId] = useState('');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();

  //if not authenticated user redirect
  useEffect(() => {
    if (!isAuthenticated && !isAnonymous && !isCheckingUser) {
      toast.error(
        `Please sign up as a guest and select your cabin before visiting this page`
      );
      navigate('../guest');
    }
  }, [isAuthenticated, isCheckingUser, navigate, isAnonymous]);

  if (isCheckingUser || isLoading || isLoadingCabin) return <Spinner />;

  //   console.table(user?.user_metadata);
  //   console.table(cabin);
  const { fullName, cabinId, guestId, startDate, endDate, nationalId } =
    user?.user_metadata ?? {};

  //convert the date strings from supabase to Date
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const stayLength = differenceInDays(end, start);

  function handleSubmit(e) {
    e.preventDefault();
    let data = {
      totalGuests: Number(+guests + 1),
      additionalNotes: notes,
      hasBreakfast: breakfast,
    };
    if (!nationalId && natId) {
      data = { ...data, nationalId: natId };
    }
    //Create the booking or simply add this final information to the user as we have everything else?

    updateGuest(data, {
      onSuccess: () => navigate('../confirm-booking'),
    });
    // console.log(e.target);
  }

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
          {' ' + format(start, 'EEEE do MMMM yyyy')} for {stayLength} nights
        </CabinSketchHeading>
        <Form onSubmit={handleSubmit}>
          <NoErrorRow>
            <label htmlFor="guestNumber">
              How many guests will be joining you (maximum of{' '}
              {cabin.maxCapacity - 1})
            </label>
            <Range
              id="guestNumber"
              min={0}
              max={cabin.maxCapacity - 1}
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              disabled={isUpdatingGuest}
            />
          </NoErrorRow>
          <CheckboxRow>
            <Checkbox
              checked={breakfast}
              onChange={() => setBreakfast((val) => !val)}
              disabled={isUpdatingGuest}
              id="addBreakfast"
            >
              <details>
                <summary>
                  Add Daily Breakfast for
                  {' ' +
                    formatCurrency(
                      settings.breakfastPrice * stayLength * (guests + 1)
                    )}
                </summary>
                Would you like to add a delicious breakfast crafted by our chefs
                to your booking for{' '}
                {`${formatCurrency(settings.breakfastPrice * stayLength)} `} per
                person? (you don&#39;t have to make a decision now, you can
                always add it when you arrive)
              </details>
            </Checkbox>
          </CheckboxRow>
          <NoErrorRow>
            <label htmlFor="notes">
              <details>
                <summary>Additional Notes</summary>
                Let us know if you have any special requests or stuff you&#39;d
                like us to know about you and your guests to make your stay as
                relaxing as possible.{' '}
                {breakfast &&
                  'If you have any dietary requirements please mention those here too so your breakfast can be the perfect start to your day.'}
              </details>
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isUpdatingGuest}
              alt="Additional Notes"
            />
          </NoErrorRow>
          {!nationalId && (
            <NoErrorRow>
              <label htmlFor="nId">
                <details>
                  <summary>National ID / Passport Number</summary>
                  Would you mind providing this information to complete this
                  booking please
                </details>
              </label>
              <Input
                id="nId"
                value={natId}
                onChange={(e) => setNatId(e.target.value)}
                disabled={isUpdatingGuest}
                alt="National ID input"
              />
            </NoErrorRow>
          )}
          <FormRow>
            <ButtonGroup>
              {/* Should I add the booking here or wait for confirmation? */}
              <Button>Confirm</Button>
            </ButtonGroup>
          </FormRow>
        </Form>
      </Container>
    </SlideInY>
  );
}

export default BookingForm;
