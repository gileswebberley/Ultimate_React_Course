import styled from 'styled-components';

const StyledButtonGroup = styled.nav`
  display: block;
  width: 100%;
  text-align: ${(props) => (props.justify === 'end' ? 'right' : 'left')};
`;

const ButtonSet = styled.nav`
  display: flex;
  gap: 1.2rem;
  width: 100%;
  max-width: fit-content;
  justify-self: flex-end;
`;
// set justify prop to change positioning, ie 'end' for the right and 'start' for the left
function ButtonGroup({ children, justify = 'end' }) {
  return (
    <StyledButtonGroup>
      <ButtonSet>{children}</ButtonSet>
    </StyledButtonGroup>
  );
}

export default ButtonGroup;
