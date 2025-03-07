import { useEffect, useMemo, useRef, useState } from 'react';
import Input from './Input';
import styled from 'styled-components';

//this ensures that the options box scrolls with the input
const Container = styled.div`
  position: relative;
  min-width: 30rem;
`;

const OptionBox = styled.div`
  position: absolute;
  z-index: 10;
  width: fit-content;
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-lg);
  border-radius: var(--border-radius-md);
  left: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const OptionList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.8rem;
  padding: 1.2rem;
`;

const Option = styled.button`
  padding: 0.2rem 1.2rem;
  border: none;
  background-color: var(--color-brand-50);
  color: var(--color-brand-800);
  &:focus {
    background-color: var(--color-brand-800);
    color: var(--color-brand-50);
  }
  &:hover {
    background-color: var(--color-brand-200);
  }
`;
//data is an array of objects with a Name value and a Code value
function Autocompleter({ data, setindex }) {
  const possibles = useMemo(() => data.map((item) => item.Name), [data]);
  const codes = useMemo(() => data.map((item) => item.Code), [data]);
  //console.log(possibles);

  //active item will be the index of the selected possibility
  const [activeItem, setActiveItem] = useState(null);
  //the value of the controlled input element
  const [inputValue, setInputValue] = useState('');
  //the array of filtered results after comparing possibles with the input value
  const [filteredItems, setFilteredItems] = useState([]);
  //just a flag for whether the options menu should be rendered
  const [displayItems, setDisplayItems] = useState(false);
  //number of filtered results that will be shown in the options
  const optionsListLength = 5;

  //for positioning under the input field
  const positionRef = useRef(null);
  const [position, setPosition] = useState({ x: 20, y: 20 });

  //get the position of our input field so we can place the drop-down list below it
  useEffect(() => {
    const posBox = positionRef?.current.getBoundingClientRect();
    //console.log(posBox);
    setPosition({ x: 10, y: posBox.height + 5 });
  }, [positionRef]);

  //handle the input changing and create the options
  useEffect(() => {
    //if input is empty or has been deleted reset everything
    if (inputValue.length < 1) {
      setFilteredItems([]);
      setDisplayItems(true);
      setActiveItem(null);
      setindex(null);
      return;
    } //or an option has been selected but then a char or more has been deleted
    else if (inputValue.length !== possibles[activeItem]?.length) {
      setDisplayItems(true);
    } //or if we have already made our selection (to get rid of longer names that start with the name selected eg united states [minor outlying islands] )
    else if (!displayItems) {
      return;
    }
    //create filtered results array and clear if it is already a complete match
    const validOptions = possibles.filter(
      (name) =>
        name.toLocaleLowerCase().startsWith(inputValue.toLocaleLowerCase()) &&
        name.toLocaleLowerCase() !== inputValue.toLocaleLowerCase()
    );
    if (validOptions.length < 1) {
      setFilteredItems([]);
      setDisplayItems(false);
      return;
    } else {
      setDisplayItems(true);
    }
    setFilteredItems(validOptions);
    // setDisplayItems(filteredItems.splice(0, optionsListLength));
  }, [inputValue, possibles, setindex, displayItems]);

  function handleSelect(e) {
    e.preventDefault();
    const value = e.target.value;
    console.log(`selected: ${e.target.value}`);
    const indexForSelection = possibles.indexOf(value);
    console.log(codes[indexForSelection]);
    setInputValue(value);
    setFilteredItems([]);
    setDisplayItems(false);
    setActiveItem(indexForSelection);
    setindex(indexForSelection);
  }

  return (
    <Container>
      <Input
        placeholder="Start typing and select option"
        ref={positionRef}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        value={inputValue}
        name="country"
        id="country"
        onChange={(e) => setInputValue(e.target.value)}
      />

      {filteredItems.length > 0 && displayItems && (
        <OptionBox position={position}>
          <OptionList>
            {filteredItems
              .map((item, i) => {
                return (
                  <li key={i}>
                    <Option onClick={handleSelect} value={item}>
                      {item}
                    </Option>
                  </li>
                );
              })
              .splice(0, optionsListLength)}
          </OptionList>
        </OptionBox>
      )}
    </Container>
  );
}

export default Autocompleter;
