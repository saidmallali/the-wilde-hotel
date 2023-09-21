import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "./useBooking";
import { useNavigate, useParams } from "react-router-dom";
import { BookingWithData } from "../../entities/Booking";
import Spinner from "../../ui/Spinner";
import {
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiTrash,
} from "react-icons/hi2";
import { useCheckout } from "../check-in-out/useCheckout";
import { useDeleteBooking } from "./useDeleteBooking";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Modal from "../../ui/Modal";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { booking, error, isLoading } = useBooking();
  const { bookingId } = useParams();
  const moveBack = useMoveBack();
  const navigate = useNavigate();
  const { checkout, isCheckeingOut } = useCheckout();
  const { deleteBooking, isDeleting } = useDeleteBooking();

  if (isLoading) return <Spinner />;
  // if (!booking) return <Spinner />;
  const { status } = booking as BookingWithData;

  if (error) return null;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{bookingId}</Heading>
          <Tag type={statusToTagName[status as keyof typeof statusToTagName]}>
            {status.replace("-", " ")}
          </Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {status === "unconfirmed" && (
          <Button
            size="large"
            variation="primary"
            onClick={() => navigate(`/checkin/${bookingId}`)}
          >
            <HiArrowDownOnSquare />
            Check in
          </Button>
        )}
        {status === "checked-in" && (
          <Button
            size="large"
            variation="primary"
            onClick={() => checkout(booking.id)}
            disabled={isCheckeingOut}
          >
            <HiArrowUpOnSquare />
            Check out
          </Button>
        )}
        {/* <Button
          size="large"
          variation="primary"
          onClick={() => deleteBooking(booking.id)}
          disabled={isDeleting}
        >
          <HiTrash />
          Delete
        </Button> */}
        <Modal>
          <Modal.Open opens="delete">
            <Button size="large" variation="danger">
              <HiTrash /> Delete
            </Button>
          </Modal.Open>
          <Modal.Window name="delete">
            <ConfirmDelete
              disabled={isDeleting}
              resourceName="booking"
              onConfirm={() =>
                deleteBooking(booking.id, {
                  onSettled: () => navigate(-1),
                })
              }
            />
          </Modal.Window>
        </Modal>

        <Button size="small" variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
