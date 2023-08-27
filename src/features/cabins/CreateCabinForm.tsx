import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { FieldValues, useForm, FieldErrors } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabin } from "../../services/apiCabins";
import { Cabin, CabinFromUser } from "../../entities/Cabin";
import { toast } from "react-hot-toast/headless";
import FormRow from "../../ui/FormRow";

function CreateCabinForm() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, getValues, formState } =
    useForm<Cabin>();
  const { errors } = formState;

  const { mutate, isLoading: isCreating } = useMutation({
    // mutationFn:createCabin
    mutationFn: (newCabin: CabinFromUser) => createCabin(newCabin),
    onSuccess: () => {
      toast.success("New cabin successfully created");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
      reset();
    },
    onError: (err: { message: string }) => {
      toast.error(err.message);
    },
  });

  const onSubmitForm = (data: FieldValues) => {
    console.log("data", data.image[0]);
    mutate({ ...(data as CabinFromUser), image: data.image?.[0] });
  };

  const onError = (errors: FieldErrors) => {
    console.log(errors);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmitForm, onError)}>
      <FormRow errors={errors.name?.message} htmlFor="name" label="Cabin name">
        <Input
          type="text"
          id="name"
          {...register("name", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow
        errors={errors.maxCapacity?.message}
        htmlFor="maxCapacity"
        label="Maximum capacity"
      >
        <Input
          type="number"
          id="maxCapacity"
          {...register("maxCapacity", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow
        errors={errors.regularPrice?.message}
        htmlFor="regularPrice"
        label="Regular price"
      >
        <Input
          type="number"
          id="regularPrice"
          {...register("regularPrice", {
            required: "This field is required",
            min: {
              value: 10,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow
        errors={errors.discount?.message}
        htmlFor="discount"
        label="Discount"
      >
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            validate: (value) =>
              value <= getValues().regularPrice ||
              "Discount should be less than regular price",
          })}
        />
      </FormRow>

      <FormRow
        errors={errors.description?.message}
        htmlFor="description"
        label="Description for cabin"
      >
        <Textarea
          id="description"
          defaultValue=""
          {...register("description", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow
        errors={errors.image?.message}
        htmlFor="image"
        label="Cabin photo"
      >
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: "this filed is required",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" size="medium" type="reset">
          Cancel
        </Button>
        <Button disabled={isCreating} variation="primary" size="medium">
          {isCreating ? "creating .." : " add cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
