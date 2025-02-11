import { createContext, useContext, useRef, useState } from 'react';
import { HiEllipsisVertical } from 'react-icons/hi2';
import styled from 'styled-components';
import { useClickOutside } from '../hooks/useClickOutside';

const Menu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: 50%;
  /* border-radius: var(--border-radius-sm); */
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-300);
  }

  &:focus {
    outline: var(--color-grey-300) solid 2px;
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: absolute;
  z-index: 10;
  width: fit-content;
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-lg);
  border-radius: var(--border-radius-md);
  /* Don't need the styled button we can just pass our styled buttons in as children of this list */
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem;

  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const MenuContext = createContext();

function Menus({ children }) {
  //similar process to the modal windows - keep a reference to the currently open menu
  const [openId, setOpenId] = useState('');
  const [position, setPosition] = useState({ x: -20, y: 40 });
  const open = setOpenId;
  const close = () => setOpenId('');

  return (
    <MenuContext.Provider
      value={{ openId, open, close, position, setPosition }}
    >
      <div>{children}</div>
    </MenuContext.Provider>
  );
}

function Toggle({ menuId }) {
  const { openId, open, close, setPosition } = useContext(MenuContext);

  //Just to control a little outline being present whilst the menu is open
  const focusRef = useRef(null);
  function handleClose() {
    // console.log(`close`);
    close();
    focusRef.current?.blur();
  }

  function handleOpen() {
    const position = focusRef.current.getBoundingClientRect();
    // console.log(position);
    setPosition((curr) => {
      return { x: position.width, y: position.height / 2 };
    });
    // console.log(`open: ${menuId}`);
    open(menuId);
  }

  function handleToggle(e) {
    e.stopPropagation();
    openId === menuId ? handleClose() : handleOpen();
  }

  return (
    <StyledToggle onClick={handleToggle} ref={focusRef}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

function List({ menuId, children }) {
  const { openId, position, close } = useContext(MenuContext);
  const outsideClickRef = useClickOutside(close, false);
  if (openId !== menuId) return null;
  return (
    <StyledList position={position} ref={outsideClickRef}>
      {children}
    </StyledList>
  );
}

function Button({ children }) {
  const { close } = useContext(MenuContext);
  return <div onClick={() => close()}>{children}</div>;
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
