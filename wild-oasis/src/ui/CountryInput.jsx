import { useEffect, useState } from 'react';
import countries_data from '../data/countries_list.json';
import Autocompleter from './Autocompleter';
import styled from 'styled-components';
import { Flag } from './Flag';

const StyledCountryInput = styled.div`
  display: flex;
  gap: 2rem;
`;

function CountryInput() {
  const [countryIndex, setCountryIndex] = useState(null);
  const countryObject =
    countryIndex !== null ? countries_data[countryIndex] : {};
  const countryFlag = `https://flagcdn.com/${countryObject?.Code?.toLowerCase()}.svg`;
  console.log(
    `country selected is: ${countryObject?.['Name']}(${countryObject?.['Code']})`
  );

  return (
    <StyledCountryInput>
      <Autocompleter data={countries_data} setindex={setCountryIndex} />
      {countryObject?.Code && (
        <Flag
          style={{ maxWidth: '5rem', fontSize: '1rem' }}
          src={countryFlag}
          alt={`flag of ${countryObject?.Name}`}
        />
      )}
    </StyledCountryInput>
  );
}

export default CountryInput;
