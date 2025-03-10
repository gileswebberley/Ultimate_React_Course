import { useEffect, useState } from 'react';
import countries_data from '../data/countries_list.json';
import Autocompleter from './Autocompleter';
import styled from 'styled-components';
import { Flag } from './Flag';
import { useGuestContext } from '../context/GuestContext';
import { useFieldArray } from 'react-hook-form';

const StyledCountryInput = styled.div`
  display: flex;
  gap: 2rem;
`;

const CountryFlag = styled(Flag)`
  max-width: 5rem;
  font-size: 1rem;
`;

function CountryInput() {
  const [countryIndex, setCountryIndex] = useState(null);
  const countryObject = countries_data[countryIndex] ?? {};
  // countryIndex !== null ? countries_data[countryIndex] : {};
  const countryFlag = `https://flagcdn.com/${countryObject?.Code?.toLowerCase()}.svg`;
  const countryName = countryObject?.Name;
  const { setNationality, setCountryFlag } = useGuestContext();

  useEffect(() => {
    if (countryIndex === null) return;
    setNationality(countryName);
    setCountryFlag(countryFlag);
  }, [countryFlag, countryIndex, countryName, setCountryFlag, setNationality]);

  return (
    <StyledCountryInput>
      <Autocompleter
        data={countries_data}
        setindex={setCountryIndex}
        completer_field="Name"
      />
      {countryObject?.Code && (
        <CountryFlag src={countryFlag} alt={`flag of ${countryObject?.Name}`} />
      )}
    </StyledCountryInput>
  );
}

export default CountryInput;
