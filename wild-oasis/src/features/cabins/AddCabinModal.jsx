import Button from '../../ui/Button';
import CreateCabinForm from './CreateCabinForm';
import CompoundModal from '../../ui/CompoundModal';

function AddCabinModal() {
  return (
    <CompoundModal>
      <CompoundModal.Open openName="add-cabin">
        {/* onClick prop is added to the button with cloneElement inside CompoundModal */}
        <Button>Add New Cabin</Button>
      </CompoundModal.Open>
      <CompoundModal.Modal contentName="add-cabin">
        {/* closeMe and presentationType props are added to the form with cloneElement inside CompoundModal */}
        <CreateCabinForm />
      </CompoundModal.Modal>
    </CompoundModal>
  );
}

export default AddCabinModal;
