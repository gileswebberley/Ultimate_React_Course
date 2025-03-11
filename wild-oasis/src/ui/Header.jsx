import styled from 'styled-components';
import Logout from '../features/authentication/Logout';
import UserAvatar from '../features/authentication/UserAvatar';
import UserSettingsButton from './UserSettingsButton';
import DarkModeToggle from './DarkModeToggle';
import { useUser } from '../features/authentication/useUser';

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

function Header() {
  const { isAuthenticated } = useUser();
  return (
    <StyledHeader>
      {isAuthenticated && (
        <>
          <UserAvatar />
          <UserSettingsButton />
          <Logout />
        </>
      )}
      <DarkModeToggle />
    </StyledHeader>
  );
}

export default Header;
