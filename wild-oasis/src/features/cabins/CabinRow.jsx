import styled from 'styled-components';
import { formatCurrency } from '../../utils/helpers';
import Button from '../../ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCabin } from '../../services/apiCabins-v1';
import toast from 'react-hot-toast';
import { useState } from 'react';
import CreateCabinForm from './CreateCabinForm';
import { useDeleteCabin } from './useDeleteCabin';

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;
  padding: 1.4rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

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
  flex-direction: column;
  gap: 0.2rem;
`;

function CabinRow({ cabin }) {
  const [showForm, setShowForm] = useState(false);
  //extracted the deletion to a custom hook because it uses a couple of hooks
  const { isDeleting, deleteCabinMutate } = useDeleteCabin();
  const { id, name, imageUrl, maxCapacity, regularPrice, discount } = cabin;

  return (
    <>
      <TableRow role="row">
        <Img src={imageUrl} alt="Image of this cabin" />
        <Cabin>{name}</Cabin>
        <div>Fits upto {maxCapacity} guests</div>
        <Price>{formatCurrency(regularPrice)}</Price>
        <Discount>{discount ? formatCurrency(discount) : 'n/a'}</Discount>
        <ButtonBox>
          <Button
            size="small"
            variation="primary"
            onClick={() => setShowForm((show) => !show)}
            disabled={isDeleting}
          >
            {showForm ? 'Close' : 'Edit'}
          </Button>
          <Button
            size="small"
            variation="danger"
            onClick={() => deleteCabinMutate(id)}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </ButtonBox>
      </TableRow>
      {showForm && (
        <CreateCabinForm
          closeMe={() => setShowForm(false)}
          cabinToEdit={cabin}
        />
      )}
    </>
  );
}

export default CabinRow;
