import styled from "styled-components";
import { Cabin } from "../../entities/Cabin";
import { formatCurrency } from "../../utils/helpers";
import Button from "../../ui/Button";
import CreateCabinForm from "./CreateCabinForm";
import { useDeleteCabin } from "./useDeleteCabin";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { useCreateCabin } from "./usecreateCabin";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";

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
  const {
    name,
    id: cabinId,
    image,
    regularPrice,
    discount,
    maxCapacity,
    description,
  } = cabinItem;

  const { isDeleting, deleteCabin } = useDeleteCabin();
  const { createNewCabin, isCreating } = useCreateCabin();

  const handelDuplicateCabin = () => {
    const newCabin = {
      name,
      image,
      regularPrice,
      description,
      discount,
      maxCapacity,
    };
    createNewCabin(newCabin as Cabin);
  };

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
            onClick={handelDuplicateCabin}
            variation="secondary"
            size="small"
            disabled={isCreating}
          >
            <HiSquare2Stack />
          </Button>
          <Modal>
            <Modal.Open opens="edit">
              <Button variation="secondary" size="small">
                <HiPencil />
              </Button>
            </Modal.Open>
            <Modal.Window name="edit">
              <CreateCabinForm cabinToEdit={cabinItem} />
            </Modal.Window>
          </Modal>

          <Modal>
            <Modal.Open opens="delete">
              <Button variation="primary" size="small">
                <HiTrash />
              </Button>
            </Modal.Open>
            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName={` cabin ${name}`}
                disabled={isDeleting}
                onConfirm={() => deleteCabin(cabinId)}
              />
            </Modal.Window>
          </Modal>
        </div>
      </TableRow>
    </>
  );
}

export default CabinRow;
