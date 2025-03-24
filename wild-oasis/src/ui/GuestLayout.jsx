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

//This keeps the header from scrolling so just the contents do, and I've switched off scrollbars in the global styles
const Main = styled.main`
  padding: 4rem 4rem;
  overflow-y: auto !important;
`;

//This is so I could apply filters to what was originally just the background-image of Main
const BackgroundImage = styled.div`
  position: fixed;
  z-index: -1;
  width: 110vw;
  height: 110vh;
  ${(props) =>
    props.$dark
      ? css`
          //dark and moody for dark mode
          background-image: url('./wild-oasis-bg.jpg');
          filter: brightness(40%) blur(var(--bg-blur-amount));
        `
      : css`
          //light and airy in light mode
          background-image: url('./wild-oasis-bg.jpg');
          filter: contrast(30%) brightness(160%) blur(var(--bg-blur-amount));
        `}
  /* There was a white border from the blur so this is to get rid of that */
  transform: scale(101%, 101%) translate(-5vw, -5vh);
  background-attachment: fixed;
  background-size: cover;
`;

// box-sizing and min-height seemed to make this a solid content holder that centres evryything vertically and horizontally - phew :/
const PageContent = styled.main`
  display: flex;
  flex-direction: column;
  box-sizing: content-box;
  height: 100%;
  width: 100%;
  min-height: fit-content;
  justify-content: center;
  align-items: center;
`;

function GuestLayout() {
  const { isDarkMode } = useDarkMode();
  return (
    <>
      <GuestContextProvider>
        <StyledGuestLayout>
          <GuestHeader />
          <Main id="main">
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
