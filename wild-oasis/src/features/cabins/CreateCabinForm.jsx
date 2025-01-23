import styled from 'styled-components';

import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCabin } from '../../services/apiCabins';
import toast from 'react-hot-toast';
import RegisteredFormInput from '../../ui/RegisteredFormInput';

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
//We're using react hook form so notice we don't have to set up the controlled elements, closeMe is simply the hide functionality from the parent component (Cabins)
function CreateCabinForm({ closeMe }) {
  //now we can spread the 'register' by passing it the field id, this automatically gives them onBlur and onChange event handlers that are linked to automatically created state (ie it makes them controlled form elements)
  //handleSubmit goes through the validation arguments in the form and if all pass it calls our submit function, otherwise it calls our onError function
  //reset is self explanatory I think
  //getValues allows us access to all of the values currently in the form fields - see our discount validation function for an example of how it can be used (discovered there is no need as you can access the same through the second parameter of the validate function)
  //formState returns various state variables such as isDirty, isValidating, etc but it also returns an object of the errors that arose during validation which we can use to show these error messages in the form
  const { register, handleSubmit, reset, formState } = useForm();
  //destructure errors from formState
  const { errors } = formState;

  const queryClient = useQueryClient();
  const { mutate, isLoading: isCreating } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      toast.success('New cabin successfully created');
      //to reload the cabins component remember to invalidate the current cabins data so that it is refetched and forces a re-render
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
      //now we can use the react hook form's reset function
      reset();
    },
    onError: () => {
      toast.error('Something went wrong whilst trying to add this new cabin');
    },
  });

  function submitCabin(data) {
    //no need to format the data as it is already, simply call the mutationFn (createCabin(newCabin))
    mutate(data);
  }

  //errors is an object made up of individual error objects for each field that has failed, eg {name:{type:'required',message:'the message'}, description:{}}
  function onError(errors) {
    toast.error('Please check that you have filled out the form correctly');
  }

  //we're going to use the react hook form's validation system to make sure all of the fields are correctly input, simply add the validation object to the register arguments.
  //If any of these fail then the handleSubmit will not call submitCabin but instead will pass the errors to our onError function
  return (
    <Form onSubmit={handleSubmit(submitCabin, onError)}>
      <RegisteredFormInput
        register={register}
        isLoading={isCreating}
        elementID="name"
        labelStr="Cabin name"
        validationObj={{
          required: 'Name is required',
        }}
        errors={errors}
        type="text"
      />

      <RegisteredFormInput
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

      <RegisteredFormInput
        register={register}
        isLoading={isCreating}
        elementID="regularPrice"
        labelStr="Regular price"
        validationObj={{
          required: 'Price is required',
        }}
        errors={errors}
        type="number"
      />

      <RegisteredFormInput
        register={register}
        isLoading={isCreating}
        elementID="discount"
        labelStr="Discount"
        validationObj={{
          validate: (value, fieldValues) =>
            Number(value) <= Number(fieldValues.regularPrice) ||
            'Discount must be less than the regular price',
        }}
        errors={errors}
        type="number"
        defaultValue={0}
      />

      <RegisteredFormInput
        register={register}
        isLoading={isCreating}
        elementID="description"
        labelStr="Description for website"
        validationObj={{
          required: 'Please supply a description',
        }}
        errors={errors}
        type="textarea"
      />

      <FormRow>
        <Label htmlFor="image">Cabin photo</Label>
        <FileInput id="image" accept="image/*" />
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          disabled={isCreating}
          onClick={() => {
            reset();
            closeMe();
          }}
        >
          Cancel
        </Button>
        <Button disabled={isCreating}>Add Cabin</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
