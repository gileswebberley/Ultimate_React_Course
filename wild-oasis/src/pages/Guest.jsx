import styled from 'styled-components';
import { GuestContextProvider } from '../context/GuestContext';
import Logo from '../ui/Logo';
import Heading from '../ui/Heading';
import GuestForm from '../features/guest/GuestForm';
import Header from '../ui/Header';

const GuestLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 68rem;
  align-content: center;
  justify-content: center;

  gap: 3.2rem;
  padding: 3.2rem 3.2rem;
  background-color: var(--color-grey-50);
`;

function Guest() {
  return (
    <GuestContextProvider>
      <Header />
      <GuestLayout>
        <Logo />
        <div>
          <Heading as="h1" style={{ textAlign: 'center', textWrap: 'balance' }}>
            Please tell us about yourself so we can start your booking
          </Heading>
        </div>
        <GuestForm />
      </GuestLayout>
    </GuestContextProvider>
  );
}

export default Guest;
