import styled from 'styled-components';
import Logout from '../features/authentication/Logout';
import { useUser } from '../features/authentication/useUser';
import SpinnerMini from './SpinnerMini';

//as we have our header component we'll name the style accordingly
const StyledHeader = styled.header`
  display: flex;
  gap: 1.6rem;
  justify-content: space-between;
  background-color: var(color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
`;

function Header() {
  const { user, isCheckingUser } = useUser();
  if (!isCheckingUser) console.table(user);
  return (
    <StyledHeader>
      {isCheckingUser ? (
        <SpinnerMini />
      ) : (
        user?.user_metadata?.fullName ?? 'Guest'
      )}
      <Logout />
    </StyledHeader>
  );
}

export default Header;
