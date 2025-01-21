import styled, { css } from 'styled-components';

const Row = styled.div`
  display: flex;

  ${(props) =>
    props.type === 'horizontal' &&
    css`
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    `}
  ${(props) =>
    props.type === 'vertical' &&
    css`
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      gap: 1.2rem;
    `}
`;

Row.defaultProps = {
  type: 'horizontal',
};

export default Row;
