import { createContext, useContext } from 'react';
import SimpleFormRow from './SimpleFormRow';
import styled, { css } from 'styled-components';
import Input from './Input';
import Textarea from './Textarea';

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
function CompoundRegisteredForm({ children, isLoading, errors, register }) {
  return (
    <registeredFormContext.Provider value={{ isLoading, errors, register }}>
      {children}
    </registeredFormContext.Provider>
  );
}

function RegisteredInput({
  elementID,
  labelStr,
  validationObj,
  type = 'text',
  defaultValue,
}) {
  //grab the general form variables from our context
  const { isLoading, errors, register } = useContext(registeredFormContext);

  if (type === 'textarea')
    return (
      <RegisteredTextarea
        {...{ elementID, labelStr, validationObj, defaultValue }}
      />
    );
  return (
    <SimpleFormRow role="row">
      <Label htmlFor={elementID}>{labelStr}</Label>
      <Input
        disabled={isLoading}
        type={type}
        id={elementID}
        defaultValue={defaultValue ?? undefined}
        {...register(elementID, validationObj)}
      />

      {errors?.[elementID]?.message && (
        <Error>{errors[elementID].message}</Error>
      )}
    </SimpleFormRow>
  );
}

function RegisteredTextarea({
  elementID,
  labelStr,
  validationObj,
  defaultValue,
}) {
  //grab the general form variables from our context
  const { isLoading, errors, register } = useContext(registeredFormContext);

  return (
    <SimpleFormRow role="row">
      <Label htmlFor={elementID}>{labelStr}</Label>
      <Textarea
        disabled={isLoading}
        type="text"
        id={elementID}
        defaultValue={defaultValue ?? undefined}
        {...register(elementID, validationObj)}
      />

      {errors?.[elementID]?.message && (
        <Error>{errors[elementID].message}</Error>
      )}
    </SimpleFormRow>
  );
}

CompoundRegisteredForm.Input = RegisteredInput;
CompoundRegisteredForm.Textarea = RegisteredTextarea;

export default CompoundRegisteredForm;
