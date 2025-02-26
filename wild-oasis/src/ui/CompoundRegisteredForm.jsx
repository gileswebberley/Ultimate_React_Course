import { createContext, useContext } from 'react';
import styled from 'styled-components';
import SimpleFormRow from './SimpleFormRow';
import Input from './Input';
import Textarea from './Textarea';
import { useForm } from 'react-hook-form';

//basic styled components
const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

//Trying to make this a compound component now that I know about the pattern
const registeredFormContext = createContext();

//All input types require a styled component called SimpleFormRow
function CompoundRegisteredForm({
  children,
  submitFn,
  errorFn,
  isLoading = null,
  defaultValues = {},
}) {
  //React-hook-form usage setup -------------------
  //mode overrides the default validation behaviour of the browser (I decided when a field loses focus is the perfect time to show the validation messages as onChange produces a lot of re-renders)
  //reValidateMode is set to onChange by default which seems bad to me considering the comment above, so I've changed it to blur
  //resetOptions is used to clear error messages when the form is reset
  const { register, handleSubmit, reset, formState } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resetOptions: { keepErrors: false },
    defaultValues: defaultValues,
  });
  const { errors } = formState;
  //if no loading state is supplied as a prop then we will use the form's isLoading prop
  isLoading = !isLoading ? formState.isLoading : isLoading;
  return (
    <form onSubmit={handleSubmit(submitFn, errorFn)}>
      <registeredFormContext.Provider
        value={{ isLoading, errors, register, reset }}
      >
        {children}
      </registeredFormContext.Provider>
    </form>
  );
}

//a wrapper for the form's reset button
function ResetButton({ children }) {
  const { reset } = useContext(registeredFormContext);
  return (
    <span
      onClick={(e) => {
        //in case there's a button as the child we don't want it to submit the form
        e.preventDefault();
        reset();
      }}
    >
      {children}
    </span>
  );
}

function RegisteredInput({
  elementID,
  labelStr,
  validationObj,
  type = 'text',
}) {
  //grab the general form variables from our context
  const { isLoading, errors, register } = useContext(registeredFormContext);

  //check that this is not being used incorrectly and safely pass on to the correct component
  if (type === 'textarea') {
    return <RegisteredTextarea {...{ elementID, labelStr, validationObj }} />;
  }
  if (type === 'email') {
    return <RegisteredEmailInput {...{ elementID, labelStr, validationObj }} />;
  }

  return (
    <SimpleFormRow role="row">
      <Label htmlFor={elementID}>{labelStr}</Label>
      <Input
        disabled={isLoading}
        type={type}
        id={elementID}
        //defaultValue={defaultValue ?? undefined}
        {...register(elementID, validationObj)}
      />

      {errors?.[elementID]?.message && (
        <Error>{errors[elementID].message}</Error>
      )}
    </SimpleFormRow>
  );
}

function RegisteredTextarea({ elementID, labelStr, validationObj }) {
  //grab the general form variables from our context
  const { isLoading, errors, register } = useContext(registeredFormContext);

  return (
    <SimpleFormRow role="row">
      <Label htmlFor={elementID}>{labelStr}</Label>
      <Textarea
        disabled={isLoading}
        type="text"
        id={elementID}
        {...register(elementID, validationObj)}
      />

      {errors?.[elementID]?.message && (
        <Error>{errors[elementID].message}</Error>
      )}
    </SimpleFormRow>
  );
}

//contains the pattern checking for a valid email address and autoComplete functionality
function RegisteredEmailInput({ elementID, labelStr, validationObj }) {
  //grab the general form variables from our context
  const { isLoading, errors, register } = useContext(registeredFormContext);

  return (
    <SimpleFormRow role="row">
      <Label htmlFor={elementID}>{labelStr}</Label>
      <Input
        disabled={isLoading}
        type="email"
        //for auto-complete functionality
        autoComplete="username"
        id={elementID}
        {...register(elementID, {
          ...validationObj,
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: 'Your email appears to be invalid',
          },
        })}
      />

      {errors?.[elementID]?.message && (
        <Error>{errors[elementID].message}</Error>
      )}
    </SimpleFormRow>
  );
}

//TODO - create a password input with visibility setting (change type from password to text)

CompoundRegisteredForm.Input = RegisteredInput;
CompoundRegisteredForm.Textarea = RegisteredTextarea;
CompoundRegisteredForm.Email = RegisteredEmailInput;
CompoundRegisteredForm.Reset = ResetButton;

export default CompoundRegisteredForm;
