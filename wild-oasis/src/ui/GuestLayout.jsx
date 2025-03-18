import styled, { css } from 'styled-components';
import { GuestContextProvider } from '../features/guest/GuestContext';
import Logo from './Logo';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import GuestForm from '../features/guest/GuestForm';
import GuestHeader from './GuestHeader';
import { useDarkMode } from '../context/DarkModeContext';

const StyledGuestLayout = styled.div`
  min-height: fit-content;
  height: 100vh;
  /* max-height: 100dvh; */
  display: grid;
  grid-template-columns: 1fr;
  /* header content footer(optional) */
  grid-template-rows: auto 1fr auto;
  /* gap: 2rem; */
  /* background-color: var(--color-grey-50); */
`;

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  position: relative;
  &::before {
    content: '';
    position: fixed;
    z-index: -1;
    width: 120%;
    height: 120%;
    ${(props) =>
      props.$dark
        ? css`
            background-image: url('./wild-oasis-bg.jpg');
            filter: brightness(40%) blur(var(--bg-blur-amount));
          `
        : css`
            background-image: url('./wild-oasis-bg.jpg');
            filter: contrast(30%) brightness(160%) blur(var(--bg-blur-amount));
          `}

    transform: scale(101%, 101%);
    background-attachment: fixed;
    background-size: cover;
  }
`;

const PageContent = styled.main`
  height: fit-content;
  align-self: center;
  justify-self: center;
`;

function GuestLayout() {
  const { isDarkMode } = useDarkMode();
  return (
    <>
      <GuestContextProvider>
        <StyledGuestLayout>
          <GuestHeader />
          <Main $dark={isDarkMode}>
            <PageContent>
              <Outlet />
            </PageContent>
          </Main>
        </StyledGuestLayout>
      </GuestContextProvider>
    </>
  );
}

export default GuestLayout;
