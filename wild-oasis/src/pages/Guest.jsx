import CompoundRegisteredForm from '../ui/CompoundRegisteredForm';

function Guest() {
  function onSubmit(data) {}

  function onError(error) {}

  return (
    <CompoundRegisteredForm
      submitFn={onSubmit}
      errorFn={onError}
      resetOnSubmit={false}
    >
      <CompoundRegisteredForm.Input
        elementID="fullName"
        labelStr="Your full name"
        validationObj={{ required: 'Please provide your name' }}
      />
    </CompoundRegisteredForm>
  );
}

export default Guest;
