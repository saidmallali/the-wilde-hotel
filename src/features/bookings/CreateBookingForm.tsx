import { useState, SetStateAction } from "react";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import { FieldValues, useForm, FieldErrors } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import { useCreateBooking } from "./useCreateBooking";
import { Booking } from "../../entities/Booking";
import DatePickerComp from "../../ui/DatePickerComp";
import Checkbox from "../../ui/Checkbox";
import { useCabins } from "../cabins/useCabins";
import Spinner from "../../ui/Spinner";
import Select from "../../ui/Select";
import { Cabin } from "../../entities/Cabin";
import SpinnerMini from "../../ui/SpinnerMini";
import { Option } from "../../ui/Filter";
import { nationalityArray } from "../../data/nationality/nationalty";
import { parseISO, format, differenceInDays } from "date-fns";

const defaultBookingToEdit = {
  created_at: "",
  id: 0,
  startDate: "",
  endDate: "",
  numNights: 0,
  numGuests: 0,
  cabinPrice: 0,
  extrasPrice: 0,
  totalPrice: 0,
  status: "",
  hasBreakfast: false,
  isPaid: false,
  observations: "",
  cabinID: 0,
  guestID: 0,
};

export interface InfoBooking {
  //geust information
  fullName: string;
  email: string;
  nationalID: string;
  nationality: string;
  countryFlag: string;
  //booking info
  id?: number;
  created_at?: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  cabinPrice?: number;
  extrasPrice?: number;
  totalPrice?: number;
  status: string;
  hasBreakfast: boolean;
  isPaid: boolean;
  observations: string;
  cabinID: number;
  guestID: number;
  cabinInfo: Cabin;
}

interface Props {
  bookingToEdit?: Booking;
  onClose?: () => void;
}

function CreateBookingForm({
  bookingToEdit = defaultBookingToEdit,
  onClose: onCloseModale,
}: Props) {
  const { id: editId, ...editValues } = bookingToEdit as InfoBooking;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState } =
    useForm<InfoBooking>({
      defaultValues: isEditSession ? editValues : {},
    });
  const { errors } = formState;

  const [hasBreakfastState, setHasBreakFast] = useState(true);
  const [startDateState, setStartDate] = useState(new Date());
  const [endDateState, setEndDateState] = useState(new Date());
  const [cabinId, setCabinId] = useState<number>();
  const [nationaltyGeust, setNationality] = useState<string>("Morocco");
  const [nationaltyFlagGust, setNationalityFlag] = useState<string>("");

  const { cabins, isLoading: isLoadingCabins } = useCabins();

  const nationaltyArrayData = nationalityArray.map((nt) => {
    return { value: nt.name, label: nt.name };
  });

  if (isLoadingCabins) return <Spinner />;

  const cabinsArray = cabins?.map((cb) => {
    return { value: cb.id, label: cb.name };
  });

  // mutationFn for createCabin
  const { createNewBooking, isCreating } = useCreateBooking();

  //mutation Function for updating a cabin
  //   const { editBooking, isEditing } = useUpdateBooking();

  //   const isWorking = isCreating || isEditing;
  const isWorking = false;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCabinId(Number(e.target.value));
  };

  const handlenationalty = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNationality(e.target.value);

    const countryFlage = nationalityArray
      .filter((nt) => nt.name === e.target.value)
      .at(0)?.file_url as SetStateAction<string>;
    setNationalityFlag(countryFlage);
  };

  const onSubmitForm = (data: FieldValues) => {
    const newBooking = data as InfoBooking;

    const cabinRegularPrice = cabins
      ?.filter((cb) => cb.id === cabinId)
      .at(0).regularPrice;

    let numNights = differenceInDays(
      parseISO(format(endDateState, "Y-M-d hh:mm:ss")),
      parseISO(format(startDateState, "Y-M-d hh:mm:ss"))
    );

    let cabinsArray = cabins as Cabin[];
    let cabinInfo = cabinsArray?.filter((cb) => cb.id === cabinId).at(0);
    console.log("cabinInfo", cabinInfo);
    console.log("cabinId", cabinId);
    if (!cabinInfo) return;
    if (!cabinId) return;
    const dataBooking = {
      ...newBooking,
      startDate: format(startDateState, "Y-M-d hh:mm:ss"),
      endDate: format(endDateState, "Y-M-d hh:mm:ss"),
      cabinID: cabinId,
      status: "checked-in",
      isPaid: true,
      cabinPrice: cabinRegularPrice,
      nationality: nationaltyGeust,
      countryFlag: nationaltyFlagGust,
      hasBreakfast: hasBreakfastState,
      numNights: numNights,
      cabinInfo: cabinInfo,
    };

    console.log("dataBooking", dataBooking);

    createNewBooking(dataBooking, {
      onSuccess: () => {
        reset();
        onCloseModale?.();
      },
    });
  };

  const onError = (errors: FieldErrors) => {
    console.log(errors);
  };

  return (
    <Form
      type={onCloseModale ? "modal" : "regular"}
      onSubmit={handleSubmit(onSubmitForm, onError)}
    >
      <FormRow
        error={errors.fullName?.message}
        htmlFor="fullName"
        label="Geust fullName"
      >
        <Input
          type="text"
          id="fullName"
          {...register("fullName", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow
        error={errors.email?.message}
        htmlFor="email"
        label="Guest email"
      >
        <Input
          type="text"
          id="email"
          {...register("email", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow
        error={errors.nationalID?.message}
        htmlFor="nationalID"
        label="Guest national ID"
      >
        <Input
          type="text"
          id="nationalID"
          {...register("nationalID", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow
        error={errors.numGuests?.message}
        htmlFor="numGuests"
        label="number of Guests"
      >
        <Input
          type="number"
          id="numGuests"
          {...register("numGuests", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Nationality">
        {isLoadingCabins ? (
          <SpinnerMini />
        ) : (
          <Select
            onChange={handlenationalty}
            options={nationaltyArrayData as Option[]}
          />
        )}
      </FormRow>
      <FormRow label="Cabin">
        {isLoadingCabins ? (
          <SpinnerMini />
        ) : (
          <Select onChange={handleChange} options={cabinsArray as Option[]} />
        )}
      </FormRow>
      <FormRow htmlFor="hasBreakfast" label="Breakfast">
        <Checkbox
          id="hasBreakfast"
          checked={hasBreakfastState}
          onChange={() => setHasBreakFast((s) => !s)}
        >
          {" "}
          has Breakfast
        </Checkbox>
      </FormRow>

      <FormRow
        error={errors.observations?.message}
        htmlFor="observations"
        label="Observation "
      >
        <Textarea id="observations" {...register("observations")} />
      </FormRow>
      <FormRow htmlFor="startDate" label="Start Date & End Date ">
        <DatePickerComp initialDate={startDateState} onchange={setStartDate} />
        <DatePickerComp initialDate={endDateState} onchange={setEndDateState} />
      </FormRow>
      {/* <FormRow htmlFor="endDate" label="End Date">
        
      </FormRow> */}

      {/* <FormRow
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
      </FormRow> */}

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

export default CreateBookingForm;
