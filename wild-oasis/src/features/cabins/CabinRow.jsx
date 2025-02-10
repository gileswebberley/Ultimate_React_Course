import styled from 'styled-components';
import { useCreateEditCabin } from './useCreateEditCabin';
import { useDeleteCabin } from './useDeleteCabin';
import { formatCurrency } from '../../utils/helpers';

import Button from '../../ui/Button';
import CreateCabinForm from './CreateCabinForm';
import SpinnerTiny from '../../ui/SpinnerTiny';
import { HiPencil, HiSquare2Stack, HiTrash } from 'react-icons/hi2';
import CompoundModal from '../../ui/CompoundModal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import Table from '../../ui/Table';

// const TableRow = styled.div`
//   display: grid;
//   grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr minmax(10rem, 1fr);
//   column-gap: 2.4rem;
//   align-items: center;
//   padding: 1.4rem 2.4rem;

//   &:not(:last-child) {
//     border-bottom: 1px solid var(--color-grey-100);
//   }
// `;

const Img = styled.img`
  display: block;
  width: 100%;
  /* height: 100%; */
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

const Price = styled.div`
  font-family: 'Sono';
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-green-700);
`;

const ButtonBox = styled.div`
  display: flex;
  /* flex-direction: column; */
  gap: 0.2rem;
`;

function CabinRow({ cabin }) {
  //extracted the deletion to a custom hook because it uses a couple of hooks
  const { isDeleting, deleteCabinMutate } = useDeleteCabin();
  const { isBusy, createEditMutate } = useCreateEditCabin();
  const isDisabled = isDeleting || isBusy;

  const {
    id,
    name,
    imageUrl,
    maxCapacity,
    regularPrice,
    discount,
    description,
  } = cabin;

  function handleDuplicateCabin() {
    createEditMutate({
      name: `Copy of ${name}`,
      maxCapacity,
      regularPrice,
      discount,
      description,
      imageUrl,
    });
  }

  //we are going to utilise our new modal window system for editing and for confirming deletion (see CabinRowNonModal for our toast based solution)
  return (
    <Table.Row>
      <Img src={imageUrl} alt="Image of this cabin" />
      <Cabin>{name}</Cabin>
      <div>Fits upto {maxCapacity} guests</div>
      <Price>{formatCurrency(regularPrice)}</Price>
      <Discount>{discount ? formatCurrency(discount) : 'n/a'}</Discount>
      <ButtonBox>
        <CompoundModal>
          <CompoundModal.Open openName="edit">
            <Button size="small" variation="primary" disabled={isDisabled}>
              {isBusy ? <SpinnerTiny /> : <HiPencil />}
            </Button>
          </CompoundModal.Open>
          <CompoundModal.Modal contentName="edit">
            <CreateCabinForm cabinToEdit={cabin} />
          </CompoundModal.Modal>
          <Button
            size="small"
            variation="primary"
            onClick={() => handleDuplicateCabin()}
            disabled={isDisabled}
          >
            {isBusy ? <SpinnerTiny /> : <HiSquare2Stack />}
          </Button>
          <CompoundModal.Open openName="delete">
            <Button size="small" variation="danger" disabled={isDisabled}>
              {isDeleting ? <SpinnerTiny /> : <HiTrash />}
            </Button>
          </CompoundModal.Open>
          <CompoundModal.Modal contentName="delete">
            <ConfirmDelete
              resourceName={`cabin (${cabin.name})`}
              onConfirm={() => deleteCabinMutate(id)}
              disabled={isDeleting}
            />
          </CompoundModal.Modal>
        </CompoundModal>
      </ButtonBox>
    </Table.Row>
  );
}

export default CabinRow;
