import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { Booking } from "../../entities/Booking";
import { useNavigate } from "react-router-dom";
interface Breakfast {
  hasBreakfast?: boolean;
  extrasPrice?: number;
  totalPrice?: number;
}

export function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: checkin, isLoading: isCheckeingIn } = useMutation({
    mutationFn: ({
      bookingId,
      breakfast,
    }: {
      bookingId: number;
      breakfast: Breakfast;
    }) =>
      updateBooking(bookingId, {
        status: "checked-in",
        isPaid: true,
        hasBreakfast: breakfast.hasBreakfast,
        extrasPrice: breakfast.extrasPrice,
        totalPrice: breakfast.totalPrice,
      }),

    onSuccess: (data: Booking) => {
      console.log("data from hook", data);
      toast.success(`Booki,g #${data.id} successfully checked in`);
      queryClient.invalidateQueries({ active: true });
      navigate("/");
    },

    onError: () => toast.error("There was an error while checking in"),
  });

  return { checkin, isCheckeingIn };
}
