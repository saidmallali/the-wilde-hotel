import { Cabin, CabinFromUser, Image } from "../entities/Cabin";
import {} from "@supabase/supabase-js";
import supabase, { supabaseUrl } from "./supabase";
export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.log(error);
    throw new Error("Cabind could not be loaded");
  }

  return data;
}

export async function deleteCabin(id: number) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) {
    console.log(error);
    throw new Error("Cabind could not be deleted");
  }

  return data;
}

async function UploadImage(imageName: string, image: Image): Promise<boolean> {
  const { error } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, image);
  console.log("error image upload", error);
  return error ? true : false;
}

export async function createCabin(newCabin: CabinFromUser) {
  const imageName =
    typeof newCabin.image !== "string"
      ? `${Math.random()}-${newCabin?.image?.name}`.replace("/", "")
      : "";

  const imagepath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  const { data, error } = await supabase
    .from("cabins")
    .insert([{ ...newCabin, image: imagepath }])
    .select()
    .single();

  if (error) {
    console.log(error);
    throw new Error("Cabind could not be created");
  }
  const newData = data as Cabin[];
  // console.log("new Cabin", data);
  // console.log("image path", imagepath);
  //uploade Image
  const storageError = await UploadImage(imageName, newCabin.image as Image);

  if (storageError) {
    await supabase.from("cabins").delete().eq("id", newData[0].id);
    throw new Error(
      "Cabind image could not be iploaded and the cabin was not created"
    );
  }

  return newData;
}

export async function updateCabin(newCabin: CabinFromUser, id: number) {
  //check if we want to update image or not (hasImagePath = true ) === we dont want to update
  let hasImagePah = false;
  if (typeof newCabin.image === "string")
    hasImagePah = newCabin.image?.startsWith(supabaseUrl);

  //create image name
  let imageName = "";
  if (typeof newCabin.image !== "string")
    imageName = `${Math.random()}-${newCabin?.image?.name}`.replace("/", "");

  const imagepath = hasImagePah
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  const { data, error } = await supabase
    .from("cabins")
    .update({ ...newCabin, image: imagepath })
    .eq("id", id)
    .select();

  if (error) {
    console.log(error);
    throw new Error("Cabind could not be created");
  }

  const newData = data as Cabin[];

  let errorStorage;
  if (!hasImagePah) {
    errorStorage = await UploadImage(imageName, newCabin.image as Image);
  }

  if (errorStorage) {
    await supabase.from("cabins").delete().eq("id", newData[0].id);
    throw new Error(
      "Cabind image could not be iploaded and the cabin was not created"
    );
  }
}

// export async function createEditeCabin(newCabin: CabinFromUser, id?: number) {
//   console.log("newCabin", newCabin, "id", id);

//   //check if we want to update image or not (hasImagePath = true ) === we dont want to update
//   let hasImagePah = false;
//   if (typeof newCabin.image === "string")
//     hasImagePah = newCabin.image?.startsWith(supabaseUrl);

//   //1. create image name
//   let imageName = "";
//   if (typeof newCabin.image !== "string")
//     imageName = `${Math.random()}-${newCabin?.image?.name}`.replace("/", "");

//   const imagepath = hasImagePah
//     ? newCabin.image
//     : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

//   console.log("imagepath", imagepath);

//   //for create and edit cabin
//   let query;

//   if (!id)
//     query = supabase.from("cabins").insert([{ ...newCabin, image: imagepath }]);
//   else
//     query = supabase
//       .from("cabins")
//       .update({ ...newCabin, image: imagepath })
//       .eq("id", id);

//   const { data, error } = await query.select().single();

//   if (error) {
//     console.log(error);
//     throw new Error("Cabind could not be created");
//   }

//   const newData = data as Cabin[];
//   //2. upload Image

//   const { error: storageError } = await supabase.storage
//     .from("avatars")
//     .upload(imageName, newCabin.image);

//   //3.delete the cabin if there was an error

//   if (storageError) {
//     await supabase.from("cabins").delete().eq("id", newData[0].id);
//     throw new Error(
//       "Cabind image could not be iploaded and the cabin was not created"
//     );
//   }

//   return data;
// }
