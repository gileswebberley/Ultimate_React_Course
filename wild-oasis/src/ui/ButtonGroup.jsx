import styled from 'styled-components';

const StyledButtonGroup = styled.nav`
  display: flex;
  justify-content: ${(props) =>
    props.justify === 'end' ? 'flex-end' : 'flex-start'};
`;

const ButtonSet = styled.nav`
  display: flex;
  flex-wrap: none;
  gap: 1.2rem;
  width: fit-content;
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
