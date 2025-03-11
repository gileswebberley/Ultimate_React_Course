import styled from 'styled-components';
import CompoundRegisteredForm from '../../ui/CompoundRegisteredForm';
import CountryInput from '../../ui/CountryInput';
import FormRow from '../../ui/FormRow';
import SimpleFormRow from '../../ui/SimpleFormRow';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import toast from 'react-hot-toast';
import {
  useGuestApiContext,
  useGuestContext,
} from '../../context/GuestContext';
import { useState } from 'react';
//for the attempt at putting the country select in here
import countries_data from '../../data/countries_list.json';

const StyledGuestForm = styled.div`
  padding: 2.4rem 4rem;

  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
`;

function GuestForm() {
  const isAddingGuest = false;
  //const { nationality, countryFlag } = useGuestContext();
  const { setName, setEmail, setCountry } = useGuestApiContext();
  let countryName = null,
    countryFlag = null;

  function handleSelect(cn, cf) {
    countryName = cn;
    countryFlag = cf;
    console.log(
      `Guest form getting country info: ${countryName} : ${countryFlag}`
    );
  }

  function onSubmit(data) {
    if (!countryName || !countryFlag) return;
    setCountry(countryName, countryFlag);
    setName(data.fullName);
    setEmail(data.email);
  }

  function onError(error) {
    toast.error(`Please make sure you have filled out all the fields
        ${error.message ? 'ERROR: ' + error.message : ''}`);
  }
  return (
    <StyledGuestForm>
      {/* <FormRow label="Which country are you from">
        <CountryInput />
      </FormRow> */}
      <CompoundRegisteredForm
        submitFn={onSubmit}
        errorFn={onError}
        isLoading={isAddingGuest}
        resetOnSubmit={false}
      >
        <CompoundRegisteredForm.Country
          elementID="country"
          labelStr="Which country are you from"
          validationObj={{ required: 'Please select your country' }}
          indexEvent={handleSelect}
        />
        <CompoundRegisteredForm.Input
          elementID="fullName"
          labelStr="Full name"
          validationObj={{ required: 'Please provide your name' }}
        />

        <CompoundRegisteredForm.Email
          elementID="email"
          labelStr="Email address"
          validationObj={{ required: 'Please provide your email' }}
        />
        <SimpleFormRow>
          <ButtonGroup>
            <CompoundRegisteredForm.Reset>
              <Button variation="secondary" disabled={isAddingGuest}>
                Reset
              </Button>
            </CompoundRegisteredForm.Reset>
            <Button disabled={isAddingGuest}>Continue</Button>
          </ButtonGroup>
        </SimpleFormRow>
      </CompoundRegisteredForm>
    </StyledGuestForm>
  );
}

export default GuestForm;
