import styled, { css } from 'styled-components';
import UserAvatar from '../features/authentication/UserAvatar';
import DarkModeToggle from './DarkModeToggle';
import { useUser } from '../features/authentication/useUser';
import LogoSmall from './LogoSmall';
import GuestLogin from '../features/guest/GuestLogin';
import Login from '../features/authentication/Login';
import Logout from '../features/authentication/Logout';
import UserHome from '../features/authentication/UserHome';
import { useDarkMode } from '../context/DarkModeContext';

//I made the dark mode change the baground gradient because it looked better with the theme affected buttons
const StyledHeader = styled.header`
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: flex-end;
  ${(props) =>
    props.$dark
      ? css`
          background: linear-gradient(
            120deg,
            var(--color-brand-500) 40%,
            var(--color-brand-900)
          );
        `
      : css`
          background: linear-gradient(
            30deg,
            var(--color-brand-900) 40%,
            var(--color-brand-500)
          );
        `}
  border-bottom: 3px solid var(--color-yellow-700);
`;

const HeaderNav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 0.8rem;
  padding: 1.2rem 2.2rem;
`;
const HeaderNavSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
`;

function GuestHeader() {
  const { isAuthenticated, isAnonymous } = useUser();
  const { isDarkMode } = useDarkMode();
  return (
    <StyledHeader $dark={isDarkMode}>
      <LogoSmall />
      <HeaderNav>
        {isAnonymous || isAuthenticated ? (
          <HeaderNavSection>
            <UserAvatar />
            <Logout />
          </HeaderNavSection>
        ) : (
          <GuestLogin />
        )}
        <HeaderNavSection>
          {!isAuthenticated ? <Login /> : <UserHome />}
          <DarkModeToggle />
        </HeaderNavSection>
      </HeaderNav>
    </StyledHeader>
  );
}

export default GuestHeader;
