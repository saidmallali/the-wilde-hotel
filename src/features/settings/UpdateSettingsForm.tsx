import { FocusEvent } from "react";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useSettings } from "./useSettings";
import Spinner from "../../ui/Spinner";
import { useUpdateSetting } from "./useUpdateSetting";

function UpdateSettingsForm() {
  const { settings = {}, isLoading, error } = useSettings();
  const {
    minBookingLength,
    maxBookingLength,
    maxGuestsPerBooking,
    breakfastPrice,
  } = settings;

  const { updateSetting, isUpdating } = useUpdateSetting();

  if (isLoading) return <Spinner />;

  const handelUpdate = (
    e: FocusEvent<HTMLInputElement, Element>,
    fieldName: string
  ) => {
    if (!e.target.value) return;
    updateSetting({ [fieldName]: e.target.value });
  };
  return (
    <Form>
      <FormRow htmlFor="minBookingLength" label="Minimum nights/booking">
        <Input
          disabled={isUpdating}
          type="number"
          id="min-nights"
          defaultValue={minBookingLength}
          onBlur={(e) => handelUpdate(e, "minBookingLength")}
        />
      </FormRow>
      <FormRow htmlFor="maxBookingLength" label="Maximum nights/booking">
        <Input
          disabled={isUpdating}
          type="number"
          id="max-nights"
          defaultValue={maxBookingLength}
          onBlur={(e) => handelUpdate(e, "maxBookingLength")}
        />
      </FormRow>
      <FormRow htmlFor="maxGuestsPerBooking" label="Maximum guests/booking">
        <Input
          disabled={isUpdating}
          type="number"
          id="max-guests"
          defaultValue={maxGuestsPerBooking}
          onBlur={(e) => handelUpdate(e, "maxGuestsPerBooking")}
        />
      </FormRow>
      <FormRow htmlFor="breakfastPrice" label="Breakfast price">
        <Input
          disabled={isUpdating}
          type="number"
          id="breakfast-price"
          defaultValue={breakfastPrice}
          onBlur={(e) => handelUpdate(e, "breakfastPrice")}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
