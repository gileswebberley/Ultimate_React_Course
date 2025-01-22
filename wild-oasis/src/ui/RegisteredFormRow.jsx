import styled from 'styled-components';
import Input from './Input';

const FormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
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

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

/** register,
  isLoading,
  elementID,
  labelStr,
  validationObj,
  errors */
function RegisteredFormRow({
  register,
  isLoading,
  elementID,
  labelStr,
  validationObj,
  errors,
  type = 'text',
}) {
  return (
    <FormRow>
      <Label htmlFor={elementID}>{labelStr}</Label>
      <Input
        disabled={isLoading}
        defaultValue={0}
        type={type}
        id={elementID}
        {
          ...register(
            elementID,
            validationObj
          ) /*no point making it required as it has a default value*/
        }
      />
      {errors?.[elementID]?.message && (
        <Error>{errors[elementID].message}</Error>
      )}
    </FormRow>
  );
}

export default RegisteredFormRow;
