import styled from 'styled-components';
import Input from './Input';
import Textarea from './Textarea';

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

/**
 * For use in a react-hook-form to create a row made up of label|input|error messages
 * @typedef {Object} Props
 * @property {UseFormRegister} register - register object returned by react-hook-form useForm hook
 * @property {Boolean} isLoading - state of retrieval of data
 * @property {String} elementID - name of the element used by label and input
 * @property {String} labelStr - text contained within the label
 * @property {Object} validationObj - react-hook-form validation object to be implemented by this input eg {required: 'This field is required'}
 * @property {Object} errors - object with error objects as value of a key equal to the elementID
 * @property {String} type - equivalent to the type prop of an html input element (enter textarea for a multiline textfield)
 * @property {any} defaultValue - [optional] value for the equivalent html input field property
 * @param {Props} props
 * @example
 * <RegisteredFormInput
        register={register}
        isLoading={isCreating}
        elementID="maxCapacity"
        labelStr="Maximum capacity"
        validationObj={{
          required: 'Max capacity is required',
          min: {
            value: 1,
            message: 'Capacity must be 1 or greater',
          },
        }}
        errors={errors}
        type="number"
      />
 **/
function RegisteredFormInput({
  register,
  isLoading,
  elementID,
  labelStr,
  validationObj,
  errors,
  type = 'text',
  defaultValue,
}) {
  return (
    <FormRow role="row">
      <Label htmlFor={elementID}>{labelStr}</Label>

      {type !== 'textarea' ? (
        <Input
          disabled={isLoading}
          type={type}
          id={elementID}
          defaultValue={defaultValue ?? undefined}
          {...register(elementID, validationObj)}
        />
      ) : (
        <Textarea
          disabled={isLoading}
          type="text"
          id={elementID}
          defaultValue={defaultValue ?? undefined}
          {...register(elementID, validationObj)}
        />
      )}

      {errors?.[elementID]?.message && (
        <Error>{errors[elementID].message}</Error>
      )}
    </FormRow>
  );
}

export default RegisteredFormInput;
