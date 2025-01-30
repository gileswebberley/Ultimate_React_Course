import styled from 'styled-components';

import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEditCabin } from '../../services/apiCabins-v1';
import toast from 'react-hot-toast';
import RegisteredFormInput from '../../ui/RegisteredFormInput';
import { useState } from 'react';

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

  &:has(button):last-child {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

const Label = styled.label`
  font-weight: 500;
`;

const EditImage = styled.img`
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  width: 10rem;
`;

const EditImgDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: end;
  min-width: 20rem;
  gap: 1.2rem;
  /* flex-direction: column; */
`;

//See CreateCabinForm-v1 for extensive learning notes
function CreateCabinForm({ closeMe, cabinToEdit }) {
  //if cabinToEdit is passed through then we are in editing mode rather than creating a new cabin
  const isEditing = Boolean(cabinToEdit);
  //if editing extract the cabin id and the current data, otherwise set both to null
  const { id: editId, ...editData } = cabinToEdit ?? {};
  //I decided to show the current image when editing and allow it to be changed if required
  const [addNewImage, setAddNewImage] = useState(!isEditing);

  //React-hook-form usage setup
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditing ? editData : {},
  });
  const { errors } = formState;

  //React query usage
  const queryClient = useQueryClient();
  const { mutate: createEditMutate, isLoading: isBusy } = useMutation({
    mutationFn: createEditCabin,
    onSuccess: (data) => {
      toast.success(
        `New cabin "${data.name}" successfully ${
          isEditing ? 'updated' : 'created'
        }`
      );
      //to reload cabins data
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
      reset();
      //and close the form? I think if we want to add multiple we'd expect to do it one at a time
      closeMe();
    },
    onError: (error) => {
      toast.error(`Something went wrong whilst trying to add this new cabin -
        ${error.message}`);
    },
  });

  function submitCabin(data) {
    if (isEditing) {
      //edit mode so we need to pass in the id
      //check if we have changed the image and structure the data accordingly by adding the oldImage property to remove the image that is no longer associated with a cabin
      data = addNewImage
        ? {
            oldImage: editData.imageUrl,
            id: editId,
            ...data,
            imageUrl: data.imageUrl[0],
          }
        : { id: editId, ...data, imageUrl: editData.imageUrl };
    } else {
      //create mode
      data = { ...data, imageUrl: data.imageUrl[0] };
    }

    createEditMutate(data);
  }

  function onError(errors) {
    toast.error('Please check that you have filled out the form correctly');
  }

  //for when you want to change the image when editing rather than creating
  function handleChangeImage(e) {
    e.preventDefault();
    setAddNewImage(true);
  }

  return (
    <Form onSubmit={handleSubmit(submitCabin, onError)}>
      <RegisteredFormInput
        register={register}
        isLoading={isBusy}
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
        isLoading={isBusy}
        elementID="maxCapacity"
        labelStr="Maximum capacity"
        validationObj={{
          required: 'Max capacity is required',
          min: {
            value: 1,
            message: 'Capacity must be 1 or greater',
          },
          max: {
            value: 30,
            message: 'Capacity cannot be greater than 30',
          },
        }}
        errors={errors}
        type="number"
      />

      <RegisteredFormInput
        register={register}
        isLoading={isBusy}
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
        isLoading={isBusy}
        elementID="discount"
        labelStr="Discount"
        validationObj={{
          validate: (value, fieldValues) =>
            +value <= +fieldValues.regularPrice ||
            'Discount must be less than the regular price',
        }}
        errors={errors}
        type="number"
        defaultValue={0}
      />

      <RegisteredFormInput
        register={register}
        isLoading={isBusy}
        elementID="description"
        labelStr="Description for website"
        validationObj={{
          required: 'Please supply a description',
        }}
        errors={errors}
        type="textarea"
      />

      <FormRow>
        {!addNewImage ? (
          <>
            <Label>Cabin photo</Label>
            <EditImgDiv>
              <EditImage src={editData.imageUrl} />
              <span>
                <Button
                  size="small"
                  disabled={isBusy}
                  onClick={handleChangeImage}
                >
                  Change Image
                </Button>
              </span>
            </EditImgDiv>
          </>
        ) : (
          <>
            <Label htmlFor="imageUrl">Cabin photo</Label>
            <FileInput
              id="imageUrl"
              accept="image/*"
              {...register('imageUrl', {
                required: 'Please add a photo of the cabin',
              })}
            />
          </>
        )}
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          disabled={isBusy}
          onClick={() => {
            reset();
            closeMe();
          }}
        >
          Cancel
        </Button>
        <Button disabled={isBusy}>{isEditing ? 'Edit' : 'Add'} Cabin</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
