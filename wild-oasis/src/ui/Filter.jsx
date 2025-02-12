import { useSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

const StyledFilter = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
`;

const FilterButton = styled.button`
  background-color: var(--color-grey-0);
  border: none;

  ${(props) =>
    props.active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;
function Filter({ filterField, options }) {
  //to add our filter to the url (so it can be seen by the cabins table)
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get(filterField) || options.at(0).value;

  function handleClick(value) {
    //create the url param (name, value)
    searchParams.set(filterField, value);
    //then add it to the url
    setSearchParams(searchParams);
  }

  return (
    <StyledFilter>
      {options.map((option, i) => {
        const isActive = activeFilter === option.value ? 'true' : undefined;
        return (
          <FilterButton
            key={i}
            onClick={() => handleClick(option.value)}
            active={isActive}
            disabled={Boolean(isActive)}
          >
            {option.title}
          </FilterButton>
        );
      })}
    </StyledFilter>
  );
}
export default Filter;
