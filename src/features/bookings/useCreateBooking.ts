import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { creatBooking } from "../../services/apiBookings";

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { mutate: createNewBooking, isLoading: isCreating } = useMutation({
    // mutationFn for createCabin
    mutationFn: creatBooking,
    onSuccess: () => {
      toast.success("New Booking successfully created");
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
    },
    onError: (err: { message: string }) => {
      toast.error(err.message);
    },
  });

  return { createNewBooking, isCreating };
}
