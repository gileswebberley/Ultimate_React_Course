import styled from 'styled-components';
import UserAvatar from '../features/authentication/UserAvatar';
import DarkModeToggle from './DarkModeToggle';
import { useUser } from '../features/authentication/useUser';
import LogoSmall from './LogoSmall';
import GuestLogin from '../features/guest/GuestLogin';
import Login from '../features/authentication/Login';
import Logout from '../features/authentication/Logout';

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
  const { isAnonymous } = useUser();
  return (
    <StyledHeader>
      <LogoSmall />
      <HeaderNav>
        <HeaderNavSection>
          <DarkModeToggle />
          <Login />
        </HeaderNavSection>
        {isAnonymous ? (
          <HeaderNavSection>
            <UserAvatar />
            <Logout />
          </HeaderNavSection>
        ) : (
          <GuestLogin />
        )}
      </HeaderNav>
    </StyledHeader>
  );
}

export default GuestHeader;
