import styled from 'styled-components';
import CompoundRegisteredForm from '../../ui/CompoundRegisteredForm';
import SimpleFormRow from '../../ui/SimpleFormRow';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import toast from 'react-hot-toast';
import { useGuestApiContext, useGuestContext } from './GuestContext';
//for the attempt at putting the country select in here
import countries_data from '../../data/countries_list.json';
import Heading from '../../ui/Heading';
import { useGuestSignIn } from './useGuestSignIn';
import { useNavigate } from 'react-router-dom';
import SlideInY from '../../ui/SlideInY';
import CabinSketchHeading from '../../ui/CabinSketchHeading';
import GuestTitleArea from '../../ui/GuestTitleArea';

const StyledGuestForm = styled.div`
  padding: 2.4rem 4rem;

  /* Box */
  width: 100%;
  max-width: 78rem;
  justify-self: center;
  background-color: var(--color-grey-100-alpha);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  margin-top: 2rem;
`;

const FormTitle = styled.div`
  padding-bottom: 2.4rem;
  max-width: 78rem;
  place-self: center;
`;

function GuestForm() {
  const { signInGuest, isSigningInGuest } = useGuestSignIn();
  const { setName, setEmail, setCountry, setNationalId } = useGuestApiContext();
  // const {
  //   fullName: guestName,
  //   email: guestEmail,
  //   nationalId: guestNId,
  // } = useGuestContext();
  // console.log(`guest: ${guestName}`);
  const navigate = useNavigate();
  let countryName = null,
    countryFlag = null;

  function handleSelect(cn, cf) {
    countryName = cn;
    countryFlag = cf;
  }

  function onSubmit(data) {
    if (!countryName || !countryFlag) {
      toast.error('Please select your country from the options');
      return;
    }
    setCountry(countryName, countryFlag);
    setName(data.fullName);
    setEmail(data.email);
    setNationalId(data.nationalId);
    signInGuest(
      {
        fullName: data.fullName,
        email: data.email,
        avatar: countryFlag,
        country: countryName,
        nationalId: data.nationalId,
      },
      {
        onSuccess: () => {
          navigate('../cabin-details');
        },
      }
    );
  }

  function onError(error) {
    toast.error(`Please make sure you have filled out all the fields
        ${error.message ? 'ERROR: ' + error.message : ''}`);
  }
  return (
    <SlideInY>
      <GuestTitleArea>
        <CabinSketchHeading as="h1" style={{ textAlign: 'center' }}>
          Please tell us about yourself so we can set you up as a guest and plan
          your perfect break
        </CabinSketchHeading>
        <br />
        <CabinSketchHeading as="h4">
          rest assured we will not use your details for spam and we certainly
          won't ever pass them onto third parties
        </CabinSketchHeading>
      </GuestTitleArea>
      <StyledGuestForm>
        <CompoundRegisteredForm
          submitFn={onSubmit}
          errorFn={onError}
          isLoading={isSigningInGuest}
        >
          <CompoundRegisteredForm.Country
            elementID="country"
            labelStr="Which country are you from"
            validationObj={{ required: 'Please select your country' }}
            indexEvent={handleSelect}
            data={countries_data}
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
          <Heading as="h4">
            Optional
            <br />
            <i>let us know when you arrive</i>
          </Heading>
          <CompoundRegisteredForm.Input
            elementID="nationalId"
            labelStr="National ID / Passport #"
            //   validationObj={{ required: 'Please provide your name' }}
          />
          <SimpleFormRow>
            <ButtonGroup>
              <CompoundRegisteredForm.Reset>
                <Button variation="secondary" disabled={isSigningInGuest}>
                  Reset
                </Button>
              </CompoundRegisteredForm.Reset>
              <Button disabled={isSigningInGuest}>Continue</Button>
            </ButtonGroup>
          </SimpleFormRow>
        </CompoundRegisteredForm>
      </StyledGuestForm>
    </SlideInY>
  );
}

export default GuestForm;
