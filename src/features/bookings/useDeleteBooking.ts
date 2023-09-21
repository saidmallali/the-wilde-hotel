import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking as deletingBooking } from "../../services/apiBookings";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isLoading: isDeleting, mutate: deleteBooking } = useMutation({
    mutationFn: (id: number) => deletingBooking(id),
    onSuccess: () => {
      toast.success("Booking successfully deleted");
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
    },
    onError: (err: { message: string }) => toast.error(err.message),
  });

  return { isDeleting, deleteBooking };
}
