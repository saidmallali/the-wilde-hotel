// import { getToday } from "../utils/helpers";
import supabase from "./supabase";
import { PAGE_SIZE } from "../utils/constants";
import { getToday } from "../utils/helpers";
import { InfoBooking } from "../features/bookings/CreateBookingForm";
import { Geust } from "../entities/Geust";

type BookingsParams = {
  filter?: { field: string; value: string; method?: string } | null;
  sortBy?: { field: string; direction: string } | null;
  page?: number;
};
export async function getBookings({ filter, sortBy, page }: BookingsParams) {
  let query = supabase
    .from("bookings")
    .select("*,cabins(name),guests(fullName,email)", {
      count: "exact",
    });
  // object return a function query (filter function)
  const filterMethods: {
    [key: string]: (field: string, value: string) => typeof query;
  } = {
    eq: (field, value) => query.eq(field, value),
    gte: (field, value) => query.gte(field, value),
    gt: (field, value) => query.gt(field, value),
    lt: (field, value) => query.lt(field, value),
    lte: (field, value) => query.lte(field, value),
  };

  if (filter && filter.field && filter.value) {
    const filterFunc = filterMethods[filter.method || "eq"];
    // execute function query how return a query
    if (filterFunc) {
      query = filterFunc(filter?.field, filter?.value);
    }
  }

  if (sortBy) {
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });
  }

  //Pagination
  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data: bookings, error, count } = await query;

  // const { data, error } = await supabase
  //   .from("bookings")s
  //   .select("*,cabins(name),guests(fullName,email)");
  if (error) {
    console.log(error);
    throw new Error("Bookings could not be loaded");
  }

  return { bookings, count };
}

export async function getBooking(id: number) {
  console.log("geting booking");
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*),guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
//date: ISOString
export async function getBookingsAfterDate(date: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");
  // .or(

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  console.log("data", data);
  return data;
}

export async function updateBooking(
  id: number,
  obj: {
    status: string;
    isPaid?: boolean;
    hasBreakfast?: boolean;
    extrasPrice?: number;
    totalPrice?: number;
  }
) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  console.log("obj", obj);
  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id: number) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}

export async function creatBooking(bookingData: InfoBooking) {
  //1- extract geust info and countryFlag to it

  let guest = {
    fullName: bookingData.fullName,
    email: bookingData.email,
    nationalID: bookingData.nationalID,
    nationality: bookingData.nationality,
    countryFlag: bookingData.countryFlag,
  };

  const { data: newGuest, error: errorCreatingGeust } = await supabase
    .from("guests")
    .insert([guest])
    .select();
  if (errorCreatingGeust) throw new Error(errorCreatingGeust.message);
  if (!newGuest) throw new Error("somting wrong ...");
  if (!newGuest) return;

  //2- create geust and add guestId to booking
  console.log(newGuest);
  let guestId;
  if (newGuest) guestId = (newGuest.at(0) as Geust).id;

  let cabinPrice;
  if (bookingData.cabinInfo)
    cabinPrice =
      bookingData.numNights *
      (bookingData.cabinInfo.regularPrice - bookingData.cabinInfo.discount);
  const extrasPrice = bookingData.hasBreakfast
    ? bookingData.numNights * 15 * bookingData.numGuests
    : 0; // hardcoded breakfast price
  let totalPrice;
  if (cabinPrice) totalPrice = cabinPrice + extrasPrice;

  const finalBookings = {
    startDate: bookingData.startDate,
    endDate: bookingData.endDate,
    numNights: bookingData.numNights,
    numGuests: bookingData.numGuests,
    status: bookingData.status,
    hasBreakfast: bookingData.hasBreakfast,
    isPaid: bookingData.isPaid,
    observations: bookingData.observations,
    cabinID: bookingData.cabinID,
    guestID: guestId,
    totalPrice: totalPrice,
    extrasPrice: extrasPrice,
    cabinPrice: cabinPrice,
  };

  console.log("finalBookings", finalBookings);

  //create Booking

  const { data: newBooking, error } = await supabase
    .from("bookings")
    .insert(finalBookings)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return { newBooking, error };
}
