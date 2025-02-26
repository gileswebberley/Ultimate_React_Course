import { useForm } from 'react-hook-form';
import Button from '../../ui/Button';
import ButtonGroup from '../../ui/ButtonGroup';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import CompoundRegisteredForm from '../../ui/CompoundRegisteredForm';

// Email regex: /\S+@\S+\.\S+/

function SignupForm() {
  //we need some validation on a larger form so we'll use react-hook-form
  const { register, formState } = useForm();
  const { errors, isLoading } = formState;

  return (
    <Form>
      {/* <FormRow label="Full name" error={''}>
        <Input type="text" id="fullName" />
      </FormRow>*/}
      <CompoundRegisteredForm
        errors={errors}
        isLoading={isLoading}
        register={register}
      >
        <CompoundRegisteredForm.Input
          type="text"
          elementID="fullName"
          labelStr="Full Name"
          validationObj={{
            required: 'Please provide your name',
          }}
        />

        {/* <FormRow label="Email address" error={''}>
          <Input type="email" id="email" />
        </FormRow> */}
        <CompoundRegisteredForm.Input
          type="email"
          elementID="email"
          labelStr="Email address"
          validationObj={{
            required: 'Please provide your email',
          }}
        />

        {/* <FormRow label="Password (min 8 characters)" error={''}>
          <Input type="password" id="password" />
        </FormRow> */}
        <CompoundRegisteredForm.Input
          type="password"
          elementID="password"
          labelStr="Password (min 8 characters)"
          validationObj={{
            required: 'Please provide your password',
          }}
        />

        {/* <FormRow label="Repeat password" error={''}>
          <Input type="password" id="passwordConfirm" />
        </FormRow> */}
        <CompoundRegisteredForm.Input
          type="password"
          elementID="password"
          labelStr="Repeat password"
          validationObj={{
            required: 'Please confirm your password',
          }}
        />
      </CompoundRegisteredForm>

      <FormRow>
        {/* type is an HTML attribute! */}
        <ButtonGroup>
          <Button variation="secondary" type="reset">
            Cancel
          </Button>
          <Button>Create new user</Button>
        </ButtonGroup>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
