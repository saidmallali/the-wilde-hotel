import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrentUser } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: (user) => {
      console.log(user);
      toast.success("User account successfully Updated");
      // invalidate querie manually
      //   queryClient.setQueryData(['user'],user)
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: (err: { message: string }) => toast.error(err.message),
  });

  return { updateUser, isUpdating };
}
