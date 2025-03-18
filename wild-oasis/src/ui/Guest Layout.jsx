import styled from 'styled-components';
import { GuestContextProvider } from '../features/guest/GuestContext';
import Logo from './Logo';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import GuestForm from '../features/guest/GuestForm';

const StyledGuestLayout = styled.div`
  min-height: fit-content;
  height: 100vh;
  /* max-height: 100dvh; */
  display: grid;
  grid-template-columns: 1fr;
  /* header content footer(optional) */
  grid-template-rows: auto 1fr auto;
  gap: 2rem;
  background-color: var(--color-grey-50);
`;

const PageContent = styled.main`
  height: fit-content;
  align-self: center;
  justify-self: center;
`;

function GuestLayout() {
  return (
    <>
      <GuestContextProvider>
        <StyledGuestLayout>
          <Header />
          <PageContent>
            <Outlet />
          </PageContent>
        </StyledGuestLayout>
      </GuestContextProvider>
    </>
  );
}

export default GuestLayout;
