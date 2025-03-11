import styled from 'styled-components';
import { GuestContextProvider } from '../context/GuestContext';
import Logo from '../ui/Logo';
import Heading from '../ui/Heading';
import GuestForm from '../features/guest/GuestForm';
import Header from '../ui/Header';

const GuestLayout = styled.main`
  /* position: fixed;
  top: 0;
  left: 0;
  width: 90%;
  height: 90%;
  margin: 5% 5%; */
  min-height: 100vh;
  display: grid;
  grid-template-columns: 68rem;
  /* grid-template-rows: 10rem 0.2fr auto; */
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
