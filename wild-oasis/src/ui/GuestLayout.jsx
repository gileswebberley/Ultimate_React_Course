import styled, { css } from 'styled-components';
import { GuestContextProvider } from '../features/guest/GuestContext';
import { Outlet } from 'react-router-dom';
import GuestHeader from './GuestHeader';
import { useDarkMode } from '../context/DarkModeContext';

const StyledGuestLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
`;

const Main = styled.main`
  padding: 4rem 4rem;
  overflow-y: auto;
`;

const BackgroundImage = styled.div`
  position: fixed;
  z-index: -1;
  width: 110vw;
  height: 110vh;
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

  transform: scale(101%, 101%) translate(-5vw, -5vh);
  background-attachment: fixed;
  background-size: cover;
`;

const PageContent = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto; /* didn't work so put in the height instead to get content vertically centred*/
  /* height: 100%; */
`;

function GuestLayout() {
  const { isDarkMode } = useDarkMode();
  return (
    <>
      <GuestContextProvider>
        <StyledGuestLayout>
          <GuestHeader />
          <Main>
            <PageContent>
              <Outlet />
            </PageContent>
          </Main>
          <BackgroundImage $dark={isDarkMode} />
        </StyledGuestLayout>
      </GuestContextProvider>
    </>
  );
}

export default GuestLayout;
