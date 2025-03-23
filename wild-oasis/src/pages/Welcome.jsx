import styled from 'styled-components';
import Heading from '../ui/Heading';
import SlideInY from '../ui/SlideInY';
import ButtonGroup from '../ui/ButtonGroup';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { useUser } from '../features/authentication/useUser';

const Container = styled.div`
  max-width: 68rem;
  display: grid;
  gap: 3rem;
  text-align: center;
  grid-template-rows: auto 1fr auto;
  padding: 2.4rem 4rem;
  background-color: var(--color-grey-100-alpha);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-xl);
`;

function Welcome() {
  const navigate = useNavigate();
  const { isAnonymous, isAuthenticated } = useUser();
  const loggedIn = isAnonymous || isAuthenticated;
  return (
    <SlideInY>
      <Container>
        <Heading style={{ color: 'var(--color-green-700)' }} as="h1">
          Welcome to Wild-Oasis
        </Heading>
        <p>
          We are a serene retreat nestled within the heart of a lush forest,
          where nature's beauty surrounds you at every turn. Our park offers a
          perfect blend of adventure and relaxation, featuring cozy
          accommodations, scenic hiking trails, and a variety of family-friendly
          activities. Explore the enchanting woods, unwind by the tranquil
          river, or simply bask in the peace of your natural surroundings. At
          Timber Haven, your unforgettable holiday experience awaits, inviting
          you to reconnect with nature and create cherished memories together.
        </p>
        <ButtonGroup>
          {!loggedIn ? (
            <Button onClick={() => navigate('../guest')}>
              Start Your Booking
            </Button>
          ) : (
            <Button onClick={() => navigate('../cabin-details')}>
              View Our Cabins
            </Button>
          )}
        </ButtonGroup>
      </Container>
    </SlideInY>
  );
}

export default Welcome;
