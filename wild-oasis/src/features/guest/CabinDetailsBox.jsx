import styled from 'styled-components';
import SlideInY from '../../ui/SlideInY';
import Heading from '../../ui/Heading';
import { bp_sizes } from '../../styles/breakpoints';
import { formatCurrency } from '../../utils/helpers';
import { useBookingDates } from '../bookings/useBookingDates';
import SpinnerMini from '../../ui/SpinnerMini';
import CabinDatePicker from './CabinDatePicker';

const StyledCabinDetailsBox = styled.div`
  display: block;
  background-color: var(--color-grey-100);
  border-radius: var(--border-radius-xl);
  padding: 3rem;
  min-width: 26rem;
  max-width: 88rem;
`;

const DetailsLayout = styled.section`
  display: flex;
  flex-direction: column;
  /* justify-content: flex-end;
  align-content: flex-end; */
  gap: 1.5rem;
  padding: 2rem;
  color: var(--color-green-700);
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
`;

const DetailsRow = styled.article`
  display: grid;
  /* background-color: red; */
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr;
  gap: 0.9rem;
  border-top: 2px solid var(--color-grey-500);
  color: var(--color-grey-800);
  padding: 1rem;
  @media ${bp_sizes.sm} {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`;

const CabinImg = styled.img`
  align-self: end;
  grid-column: 1;
  min-width: 18rem;
  width: 28rem;
`;

const Paragraph = styled.p`
  text-wrap: balance;
  text-align: justify;

  overflow: auto;
  word-wrap: normal;
  height: 19rem;
`;

function CabinDetailsBox({ cabin }) {
  // console.log(cabin.id);
  const { isLoading, error, bookingDates } = useBookingDates(cabin.id);

  if (error) return <div>ERROR: {error}</div>;

  return (
    <SlideInY>
      <StyledCabinDetailsBox>
        <DetailsLayout>
          <Heading as="h2">
            {cabin.name} for {cabin.maxCapacity} Guests
          </Heading>
          <DetailsRow>
            <CabinImg
              src={cabin.imageUrl}
              alt={`Image of Cabin ${cabin.name}`}
            />
            <div>
              <Paragraph>{cabin.description}</Paragraph>
            </div>
          </DetailsRow>
          <DetailsRow>
            <Heading as="h3">
              {formatCurrency(cabin.regularPrice)} per night
            </Heading>
            {isLoading ? (
              <SpinnerMini />
            ) : (
              <CabinDatePicker reservedDates={bookingDates} />
            )}
          </DetailsRow>
        </DetailsLayout>
      </StyledCabinDetailsBox>
    </SlideInY>
  );
}

export default CabinDetailsBox;
