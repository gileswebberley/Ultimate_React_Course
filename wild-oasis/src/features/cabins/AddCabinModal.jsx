import { useState } from 'react';
import Button from '../../ui/Button';
import CreateCabinForm from './CreateCabinForm';
import Modal from '../../ui/Modal';

function AddCabinModal() {
  const [showForm, setShowForm] = useState(false);
  const closeModal = () => setShowForm(false);
  return (
    <>
      {!showForm && (
        <Button onClick={() => setShowForm((show) => !show)}>
          Add New Cabin
        </Button>
      )}
      {showForm && (
        <Modal closeMe={closeModal}>
          <CreateCabinForm closeMe={closeModal} presentationType="modal" />
        </Modal>
      )}
    </>
  );
}

export default AddCabinModal;
