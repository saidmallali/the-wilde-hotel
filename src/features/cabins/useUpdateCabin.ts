import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCabin as updateCabinApi } from "../../services/apiCabins";
import { CabinFromUser } from "../../entities/Cabin";
import { toast } from "react-hot-toast";

export function useUpdateCabin() {
  const queryClient = useQueryClient();
  const { mutate: editCabin, isLoading: isEditing } = useMutation({
    mutationFn: ({
      newCabin,
      editId,
    }: {
      newCabin: CabinFromUser;
      editId: number;
    }) => updateCabinApi(newCabin, editId),
    onSuccess: () => {
      toast.success("Cabin Successfully Updated");
      console.log("Cabin Successfully Updated");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: (err: { message: string }) => {
      toast.error(err.message);
    },
  });

  return { editCabin, isEditing };
}
