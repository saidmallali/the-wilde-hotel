import { useState } from "react";

import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

import { useUser } from "./useUser";
import { useUpdateUser } from "./useUpdateUser";
function UpdateUserDataForm() {
  // We don't need the loading state, and can immediately use the user data, because we know that it has already been loaded at this point
  const { user } = useUser();

  if (!user) return null;

  const { email, user_metadata } = user;
  const { fullName: currentFullName } = user_metadata;

  const [fullName, setFullName] = useState<string>(currentFullName);

  const [avatar, setAvatar] = useState<File | undefined>();
  const { updateUser, isUpdating } = useUpdateUser();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log(fullName);
    e.preventDefault();

    if (!fullName) return;
    updateUser(
      { fullName, avatar },
      {
        onSuccess: () => {
          setAvatar(undefined);
        },
      }
    );
  }

  const handleavatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setAvatar(e.target.files[0]);
  };

  const handleCancel = () => {
    setFullName(currentFullName);
    setAvatar(undefined);
  };
  return (
    <Form onSubmit={(e) => handleSubmit(e)}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*"
          onChange={(ev) => handleavatar(ev)}
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow>
        <Button
          onClick={handleCancel}
          size="medium"
          type="reset"
          variation="secondary"
        >
          Cancel
        </Button>
        <Button disabled={isUpdating} variation="primary" size="medium">
          Update account
        </Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
