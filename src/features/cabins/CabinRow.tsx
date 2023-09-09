import styled from "styled-components";
import { Cabin } from "../../entities/Cabin";
import { formatCurrency } from "../../utils/helpers";
import CreateCabinForm from "./CreateCabinForm";
import { useDeleteCabin } from "./useDeleteCabin";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { useCreateCabin } from "./usecreateCabin";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

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
      <Table.Row>
        <Img src={image} />
        <CabinDiv>{name}</CabinDiv>
        <div>Fits up to {maxCapacity} quests </div>
        <Price>{formatCurrency(regularPrice)}</Price>
        {discount ? (
          <Discount>{formatCurrency(discount)}</Discount>
        ) : (
          <span> NO </span>
        )}
        <div>
          <Modal>
            <Menus.Menu>
              <Menus.Toggle id={cabinId.toString()} />
              <Menus.List id={cabinId.toString()}>
                <Menus.Button
                  onClick={handelDuplicateCabin}
                  icon={<HiSquare2Stack />}
                >
                  duplicate
                </Menus.Button>
                <Modal.Open opens="edit">
                  <Menus.Button icon={<HiPencil />}>edit</Menus.Button>
                </Modal.Open>
                <Modal.Open opens="delete">
                  <Menus.Button icon={<HiTrash />}>delete</Menus.Button>
                </Modal.Open>
              </Menus.List>
            </Menus.Menu>

            <Modal.Window name="edit">
              <CreateCabinForm cabinToEdit={cabinItem} />
            </Modal.Window>
            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName={` cabin ${name}`}
                disabled={isDeleting}
                onConfirm={() => deleteCabin(cabinId)}
              />
            </Modal.Window>
          </Modal>
        </div>
      </Table.Row>
    </>
  );
}

export default CabinRow;
