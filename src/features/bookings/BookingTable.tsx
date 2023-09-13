import BookingRow from "./BookingRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import { useBookings } from "./useBookings";
import { BookingWithData } from "../../entities/Booking";
import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination";

function BookingTable() {
  const { data, isLoading, error } = useBookings();
  const bookings = data?.bookings as BookingWithData[];
  const count = data?.count;

  // const bookings = data as BookingWithData[];
  // const bookings = [{}] as BookingWithData[];

  if (isLoading) return <Spinner />;
  if (!bookings!.length) return <Empty resource="bookings" />;
  if (error) return null;

  return (
    <Menus>
      <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
        <Table.Header>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </Table.Header>

        {bookings && (
          <Table.Body
            data={bookings}
            render={(booking: BookingWithData) => (
              <BookingRow key={booking.id} bookingData={booking} />
            )}
          />
        )}
        <Table.Footer> {count && <Pagination count={count} />}</Table.Footer>
      </Table>
    </Menus>
  );
}

export default BookingTable;
