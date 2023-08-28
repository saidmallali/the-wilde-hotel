import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabin as creatCabinApi } from "../../services/apiCabins";
import { CabinFromUser } from "../../entities/Cabin";
import { toast } from "react-hot-toast";

export function useCreateCabin() {
  const queryClient = useQueryClient();
  const { mutate: createNewCabin, isLoading: isCreating } = useMutation({
    // mutationFn for createCabin
    mutationFn: (newCabin: CabinFromUser) => creatCabinApi(newCabin),
    onSuccess: () => {
      toast.success("New cabin successfully created");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: (err: { message: string }) => {
      toast.error(err.message);
    },
  });

  return { createNewCabin, isCreating };
}
