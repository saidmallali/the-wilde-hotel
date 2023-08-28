import { useState } from "react";
import styled from "styled-components";
import { Cabin } from "../../entities/Cabin";
import { formatCurrency } from "../../utils/helpers";
import Button from "../../ui/Button";
import CreateCabinForm from "./CreateCabinForm";
import { useDeleteCabin } from "./useDeleteCabin";

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
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const CabinDiv = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

interface Props {
  cabinItem: Cabin;
}

function CabinRow({ cabinItem }: Props) {
  const [showForm, setShowForm] = useState(false);
  const {
    name,
    id: cabinId,
    image,
    regularPrice,
    discount,
    maxCapacity,
  } = cabinItem;

  const { isDeleting, deleteCabin } = useDeleteCabin();

  return (
    <>
      <TableRow>
        <Img src={image} />
        <CabinDiv>{name}</CabinDiv>
        <div>Fits up to {maxCapacity} quests </div>
        <Price>{formatCurrency(regularPrice)}</Price>
        {discount ? (
          <Discount>{formatCurrency(discount)}</Discount>
        ) : (
          <span>&mdash</span>
        )}
        <div>
          <Button
            onClick={() => setShowForm((state) => !state)}
            variation="secondary"
            size="small"
          >
            {!showForm ? "Edit" : "hide Form"}
          </Button>
          <Button
            disabled={isDeleting}
            onClick={() => deleteCabin(cabinId)}
            variation="primary"
            size="small"
          >
            Delete
          </Button>
        </div>
      </TableRow>
      {showForm && <CreateCabinForm cabinToEdit={cabinItem} />}
    </>
  );
}

export default CabinRow;
