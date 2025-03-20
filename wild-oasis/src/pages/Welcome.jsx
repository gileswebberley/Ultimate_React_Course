import styled from 'styled-components';
import Heading from '../ui/Heading';
import SlideInY from '../ui/SlideInY';

const Container = styled.div`
  max-width: 68rem;
  display: grid;
  gap: 3rem;
  text-align: center;
  grid-template-rows: auto 1fr;
  padding: 2.4rem 4rem;
  background-color: var(--color-grey-0);
  border: 3px solid var(--color-grey-100);
  border-radius: var(--border-radius-xl);
`;

function Welcome() {
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
      </Container>
    </SlideInY>
  );
}

export default Welcome;
