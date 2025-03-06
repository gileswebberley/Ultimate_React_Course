import styled, { css } from 'styled-components';
import { useState } from 'react';
import Logo from './Logo';
import MainNav from './MainNav';
import Uploader from '../data/Uploader';

//going to try to make this a collapsing menu
const transform = {
  open: css`
    transform: translate(0);
    transition: ease-in-out 0.8s;
  `,

  closed: css`
    transform: translate(-94%);
    transition: ease-in-out 0.8s;
  `,
};

//now that this is within a grid layout (in StyledAppLayout) it becomes a grid-item. To make it span from row 1 to the end of the grid rows we set it as 1 / -1
const StyledSidebar = styled.aside`
  grid-row: 1/-1;
  display: grid;
  grid-template-columns: 26rem 1.5rem;
  grid-template-rows: auto 1fr;
  height: 100dvh;
  gap: 2.2rem;
  background-color: var(--color-grey-0);
  padding: 3.2rem 0.2rem;
  border-right: 1px solid var(--color-grey-100);
  position: absolute;
  z-index: 11;
  ${(props) => transform[props.transform]}
`;

const ClickBit = styled.div`
  background-color: var(--color-grey-300);
  border-radius: 0.5rem;
  grid-column: 2;
  grid-row: 1/-1;
`;

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpen(e) {
    e.preventDefault();
    setIsOpen((open) => !open);
  }
  return (
    <StyledSidebar
      transform={isOpen ? 'open' : 'closed'}
      onClick={handleOpen}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Logo />
      <ClickBit
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => {
          if (!isOpen) setIsOpen(true);
        }}
      />
      <MainNav />
      {/* <Uploader /> */}
    </StyledSidebar>
  );
}

export default Sidebar;
