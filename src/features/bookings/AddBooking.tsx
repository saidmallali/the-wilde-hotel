import Button from "../../ui/Button";
import CreateBookingForm from "./CreateBookingForm";
import Modal from "../../ui/Modal";

const AddBooking = () => {
  return (
    <div>
      <Modal>
        <Modal.Open opens="booking-form">
          <Button size="medium" variation="primary">
            Add new Booking
          </Button>
        </Modal.Open>
        <Modal.Window name="booking-form">
          <CreateBookingForm onClose={close} />
        </Modal.Window>
      </Modal>
    </div>
  );
};

export default AddBooking;
