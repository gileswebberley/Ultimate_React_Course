import styled from 'styled-components';
import Logout from '../features/authentication/Logout';
import UserAvatar from '../features/authentication/UserAvatar';
import UserSettingsButton from './UserSettingsButton';
import DarkModeToggle from './DarkModeToggle';
import { useUser } from '../features/authentication/useUser';
import Login from '../features/authentication/Login';
import Logo from './Logo';

//as we have our header component we'll name the style accordingly
const StyledHeader = styled.header`
  /* grid-row: 1;
  grid-column: 1/-1; */
  display: flex;
  gap: 1.6rem;
  justify-content: flex-end;
  align-items: center;
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
`;

const HeaderNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
`;

const HeaderLogo = styled.div`
  transform: scale(0.7) translate(0, -80%);
  height: 3rem;
`;

function Header() {
  const { isAuthenticated, isAnonymous } = useUser();
  return (
    <StyledHeader>
      <HeaderLogo>
        <Logo />
      </HeaderLogo>
      <HeaderNav>
        {isAuthenticated ? (
          <>
            <UserAvatar />
            <UserSettingsButton />
            <Logout />
          </>
        ) : isAnonymous ? (
          <>
            <UserAvatar />
            {/* <Logout /> */}
          </>
        ) : (
          <Login />
        )}
        <DarkModeToggle />
      </HeaderNav>
    </StyledHeader>
  );
}

export default Header;
