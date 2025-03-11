import styled from 'styled-components';

const SimpleFormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1.2fr 1fr;
  gap: 2.4rem;

  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

SimpleFormRow.defaultProps = {
  role: 'row',
};

export default SimpleFormRow;
