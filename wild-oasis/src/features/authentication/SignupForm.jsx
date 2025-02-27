import Button from '../../ui/Button';
import ButtonGroup from '../../ui/ButtonGroup';
import CompoundRegisteredForm from '../../ui/CompoundRegisteredForm';
import toast from 'react-hot-toast';
import styled, { css } from 'styled-components';
import SimpleFormRow from '../../ui/SimpleFormRow';

const FormContainer = styled.div`
  ${(props) =>
    props.type !== 'modal' &&
    css`
      padding: 2.4rem 4rem;

      /* Box */
      background-color: var(--color-grey-0);
      border: 1px solid var(--color-grey-100);
      border-radius: var(--border-radius-md);
    `}

  ${(props) =>
    props.type === 'modal' &&
    css`
      max-width: 80rem;
    `}
    
  overflow: hidden;
  font-size: 1.4rem;
`;

// Email regex: /\S+@\S+\.\S+/

function SignupForm() {
  function submitNewUser(data) {
    console.table(data);
  }

  //errors is the same as our errors object above
  function onError(errors) {
    toast.error('Please check that you have filled out the form correctly');
  }

  return (
    <FormContainer>
      <CompoundRegisteredForm
        // isLoading={isLoading}
        submitFn={submitNewUser}
        errorFn={onError}
        defaultValues={{ fullName: 'Giles' }}
      >
        <CompoundRegisteredForm.Input
          type="text"
          elementID="fullName"
          labelStr="Full Name"
          validationObj={{
            required: 'Please provide your name',
          }}
        />
        <CompoundRegisteredForm.Email
          elementID="email"
          labelStr="Email address"
          validationObj={{
            required: 'Please provide your email',
          }}
        />
        <CompoundRegisteredForm.Password
          //type="password"
          elementID="password"
          labelStr="Password (min 8 characters)"
          validationObj={{
            required: 'Please provide your password',
            minLength: {
              value: 8,
              message: 'Password should contain at least 8 characters',
            },
          }}
        />
        <CompoundRegisteredForm.Password
          elementID="passwordConfirm"
          labelStr="Confirm password"
          validationObj={{
            required: 'Please confirm your password',
            validate: (value, fieldValues) => {
              return (
                value === fieldValues.password ||
                'This appears to be different from your password'
              );
            },
          }}
        />
        <SimpleFormRow>
          <ButtonGroup>
            <CompoundRegisteredForm.Reset>
              <Button variation="secondary">Reset</Button>
            </CompoundRegisteredForm.Reset>
            <Button>Create new user</Button>
          </ButtonGroup>
        </SimpleFormRow>
      </CompoundRegisteredForm>
    </FormContainer>
  );
}

export default SignupForm;
