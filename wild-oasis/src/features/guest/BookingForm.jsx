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
import { useState } from 'react';
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
  const { isCheckingUser, user } = useUser();
  const { isLoading: isLoadingCabin, error, cabin } = useCabin();
  const { isLoading, settings } = useSettings();

  const [guests, setGuests] = useState(0);
  const [breakfast, setBreakfast] = useState(false);
  const [natId, setNatId] = useState('');

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
            />
          </NoErrorRow>
          <CheckboxRow>
            <Checkbox
              checked={breakfast}
              onChange={() => setBreakfast((val) => !val)}
              // disabled={isAddingBreakfast}
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
