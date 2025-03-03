import styled from 'styled-components';
import Logout from '../features/authentication/Logout';
import UserAvatar from '../features/authentication/UserAvatar';
import UserSettingsButton from './UserSettingsButton';

//as we have our header component we'll name the style accordingly
const StyledHeader = styled.header`
  display: flex;
  gap: 1.6rem;
  justify-content: flex-end;
  align-items: center;
  background-color: var(color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
`;

function Header() {
  return (
    <StyledHeader>
      <UserAvatar />
      <UserSettingsButton />
      <Logout />
    </StyledHeader>
  );
}

export default Header;
