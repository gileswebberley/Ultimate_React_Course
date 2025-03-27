import styled from 'styled-components';
import SlideInY from '../ui/SlideInY';
import ButtonGroup from '../ui/ButtonGroup';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { useUser } from '../features/authentication/useUser';
import GuestTitleArea from '../ui/GuestTitleArea';
import CabinSketchHeading from '../ui/CabinSketchHeading';
import GuestParagraph from '../ui/GuestParagraph';
import { bp_sizes } from '../styles/breakpoints';

const Container = styled.div`
  max-width: 78rem;
  display: grid;
  gap: 3rem;
  grid-template-rows: 1fr auto;
  grid-template-columns: 1fr;
  padding: 2.4rem 4rem;
  margin: 1rem 1rem;
  background-color: var(--color-grey-100-alpha);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-xl);
`;

function Welcome() {
  const navigate = useNavigate();
  const { isAnonymous, isAuthenticated } = useUser();
  const isLoggedIn = isAnonymous || isAuthenticated;
  return (
    <SlideInY>
      <GuestTitleArea>
        <CabinSketchHeading as="h1">WELCOME TO WILD OASIS</CabinSketchHeading>
        <CabinSketchHeading as="h2">
          It&#39;s only natural to need a break from the rush of modern life
          which is why we offer our little bit of wilderness
        </CabinSketchHeading>
      </GuestTitleArea>
      <Container>
        <GuestParagraph>
          We are a serene retreat nestled within the heart of a lush forest,
          where nature's beauty surrounds you at every turn. Our park offers a
          perfect blend of adventure and relaxation, featuring cozy
          accommodations, scenic hiking trails, and a variety of family-friendly
          activities. Explore the enchanting woods, unwind by the tranquil
          river, or simply bask in the peace of your natural surroundings. At
          Timber Haven, your unforgettable holiday experience awaits, inviting
          you to reconnect with nature and create cherished memories together.
        </GuestParagraph>
        <ButtonGroup>
          {!isLoggedIn && (
            <Button onClick={() => navigate('../guest')}>
              Start Your Booking
            </Button>
          )}
          <Button onClick={() => navigate('../cabin-details')}>
            View Our Cabins
          </Button>
        </ButtonGroup>
      </Container>
    </SlideInY>
  );
}

export default Welcome;
