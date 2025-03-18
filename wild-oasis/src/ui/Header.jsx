import styled from 'styled-components';
import Logout from '../features/authentication/Logout';
import UserAvatar from '../features/authentication/UserAvatar';
import UserSettingsButton from './UserSettingsButton';
import DarkModeToggle from './DarkModeToggle';
import { useUser } from '../features/authentication/useUser';
import Login from '../features/guest/GuestLogin';

//as we have our header component we'll name the style accordingly
const StyledHeader = styled.header`
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

function Header() {
  const { isAuthenticated } = useUser();
  return (
    <StyledHeader>
      <HeaderNav>
        {isAuthenticated ? (
          <>
            <UserAvatar />
            <UserSettingsButton />
            <Logout />
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
