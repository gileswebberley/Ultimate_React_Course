import styled, { css } from 'styled-components';

const Row = styled.div`
  display: flex;

  ${(props) =>
    props.orientation === 'horizontal' &&
    css`
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    `}
  ${(props) =>
    props.orientation === 'vertical' &&
    css`
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      gap: 1.2rem;
    `}
`;

export default Row;
