import styled from 'styled-components';

const StyledButtonGroup = styled.nav`
  display: flex;
  justify-content: flex-end;
  /* width: fit-content; */
`;

const ButtonSet = styled.nav`
  display: flex;
  flex-wrap: none;
  gap: 1.2rem;
  width: fit-content;
`;

function ButtonGroup({ children }) {
  return (
    <StyledButtonGroup>
      <ButtonSet>{children}</ButtonSet>
    </StyledButtonGroup>
  );
}

export default ButtonGroup;
