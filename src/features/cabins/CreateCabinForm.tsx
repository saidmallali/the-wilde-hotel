import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { FieldValues, useForm, FieldErrors } from "react-hook-form";
import { Cabin, CabinFromUser } from "../../entities/Cabin";
import FormRow from "../../ui/FormRow";
import { useUpdateCabin } from "./useUpdateCabin";
import { useCreateCabin } from "./usecreateCabin";

const defaultCabinToEdit = {
  created_at: "",
  description: "",
  discount: 0,
  id: 0,
  image: "",
  maxCapacity: 0,
  name: "",
  regularPrice: 0,
};

interface Props {
  cabinToEdit?: Cabin;
  onClose?: () => void;
}

function CreateCabinForm({
  cabinToEdit = defaultCabinToEdit,
  onClose: onCloseModale,
}: Props) {
  const { id: editId, ...editValues } = cabinToEdit as Cabin;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState } =
    useForm<Cabin>({
      defaultValues: isEditSession ? editValues : {},
    });
  const { errors } = formState;

  // mutationFn for createCabin
  const { createNewCabin, isCreating } = useCreateCabin();

  //mutation Function for updating a cabin
  const { editCabin, isEditing } = useUpdateCabin();

  const isWorking = isCreating || isEditing;

  const onSubmitForm = (data: FieldValues) => {
    const image = typeof data.image === "string" ? data.image : data.image[0];
    const newCabin = { ...data, image: image } as CabinFromUser;

    isEditSession
      ? editCabin(
          { newCabin, editId },
          {
            onSuccess: () => {
              reset();
              onCloseModale?.();
            },
          }
        )
      : createNewCabin(newCabin, {
          onSuccess: () => {
            reset();
            onCloseModale?.();
          },
        });

    // mutate({ ...(data as CabinFromUser), image: data.image?.[0] });
  };

  const onError = (errors: FieldErrors) => {
    console.log(errors);
  };

  return (
    <Form
      type={onCloseModale ? "modal" : "regular"}
      onSubmit={handleSubmit(onSubmitForm, onError)}
    >
      <FormRow error={errors.name?.message} htmlFor="name" label="Cabin name">
        <Input
          type="text"
          id="name"
          {...register("name", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow
        error={errors.maxCapacity?.message}
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
        error={errors.regularPrice?.message}
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
              message: "value should be at least 10$",
            },
          })}
        />
      </FormRow>

      <FormRow
        error={errors.discount?.message}
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
        error={errors.description?.message}
        htmlFor="description"
        label="Description for cabin"
      >
        <Textarea
          id="description"
          {...register("description", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow
        error={errors.image?.message}
        htmlFor="image"
        label="Cabin photo"
      >
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: isEditSession ? false : "this filed is required",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          onClick={() => onCloseModale?.()}
          variation="secondary"
          size="medium"
          type="reset"
        >
          Cancel
        </Button>
        <Button disabled={isWorking} variation="primary" size="medium">
          {isEditSession ? "Edit cabin" : " Create new cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
