import styled from 'styled-components';
import Logout from '../features/authentication/Logout';

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
  return (
    <StyledHeader>
      <div>{''}</div>
      <Logout />
    </StyledHeader>
  );
}

export default Header;
