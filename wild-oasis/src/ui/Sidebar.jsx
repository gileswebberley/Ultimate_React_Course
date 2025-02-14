import styled from 'styled-components';
import Logo from './Logo';
import MainNav from './MainNav';
import Uploader from '../data/Uploader';

//now that this is within a grid layout (in StyledAppLayout) it becomes a grid-item. To make it span from row 1 to the end of the grid rows we set it as 1 / -1
const StyledSidebar = styled.aside`
  grid-row: 1/-1;
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  border-right: 1px solid var(--color-grey-100);
`;

function Sidebar() {
  return (
    <StyledSidebar>
      <Logo />
      <MainNav />
      {/* <Uploader /> */}
    </StyledSidebar>
  );
}

export default Sidebar;
