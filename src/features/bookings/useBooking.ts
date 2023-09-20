import { useQuery } from "@tanstack/react-query";
import { getBooking } from "../../services/apiBookings";
import { useParams } from "react-router-dom";
import { BookingWithData } from "../../entities/Booking";

export function useBooking(): {
  booking: BookingWithData;
  isLoading: boolean;
  error: unknown;
} {
  const { bookingId } = useParams();
  const id = Number(bookingId);
  const {
    data: booking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBooking(id),
    retry: false,
  });

  return { booking, isLoading, error };
}
