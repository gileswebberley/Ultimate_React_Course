import styled from 'styled-components';
import SlideInY from '../../ui/SlideInY';
import Heading from '../../ui/Heading';
import { bp_sizes } from '../../styles/breakpoints';
import { formatCurrency } from '../../utils/helpers';

const StyledCabinDetailsBox = styled.div`
  display: block;
  background-color: var(--color-grey-100);
  border-radius: var(--border-radius-xl);
  padding: 3rem;
  min-width: 26rem;
`;

const DetailsLayout = styled.article`
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

const DetailsRow = styled.div`
  display: grid;
  /* background-color: var(--color-grey-0); */
  grid-template-columns: auto 30rem;
  grid-template-rows: 1fr;
  gap: 0.9rem;
  border-top: 2px solid var(--color-grey-500);
  color: var(--color-grey-800);
  padding-top: 1rem;
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

  overflow: auto;
  word-wrap: normal;
  height: 19rem;
`;

function CabinDetailsBox({ cabin }) {
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
          </DetailsRow>
        </DetailsLayout>
      </StyledCabinDetailsBox>
    </SlideInY>
  );
}

export default CabinDetailsBox;
