import styled from 'styled-components';
import UserAvatar from '../features/authentication/UserAvatar';
import DarkModeToggle from './DarkModeToggle';
import { useUser } from '../features/authentication/useUser';
import Login from '../features/authentication/Login';
import LogoSmall from './LogoSmall';

//as we have our header component we'll name the style accordingly
const StyledHeader = styled.header`
  /* grid-row: 1;
  grid-column: 1/-1; */
  display: flex;
  /* gap: 1.6rem; */
  justify-content: space-between;
  align-items: flex-end;
  background: linear-gradient(
    30deg,
    var(--color-brand-900) 40%,
    var(--color-brand-500)
  );
  border-bottom: 3px solid var(--color-yellow-700);
`;

const HeaderNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 1.2rem 2.8rem;
`;

function GuestHeader() {
  const { isAnonymous } = useUser();
  return (
    <StyledHeader>
      <LogoSmall />
      <HeaderNav>
        {isAnonymous ? (
          <>
            <UserAvatar />
          </>
        ) : (
          <Login />
        )}
        <DarkModeToggle />
      </HeaderNav>
    </StyledHeader>
  );
}

export default GuestHeader;
