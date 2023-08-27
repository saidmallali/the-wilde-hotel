import { Cabin, CabinFromUser } from "../entities/Cabin";
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

export async function createCabin(newCabin: CabinFromUser) {
  //1. create cabin

  const imageName = `${Math.random()}-${newCabin?.image?.name}`.replace(
    "/",
    ""
  );

  const imagepath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  const { data, error } = await supabase
    .from("cabins")
    .insert([{ ...newCabin, image: imagepath }])
    .select();

  if (error) {
    console.log(error);
    throw new Error("Cabind could not be created");
  }

  const newData = data as Cabin[];
  //2. upload Image

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  //3.delete the cabin if there was an error

  if (storageError) {
    await supabase.from("cabins").delete().eq("id", newData[0].id);
    throw new Error(
      "Cabind image could not be iploaded and the cabin was not created"
    );
  }

  return data;
}
