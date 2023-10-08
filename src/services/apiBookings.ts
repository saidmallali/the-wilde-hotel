// import { getToday } from "../utils/helpers";
import supabase from "./supabase";
import { PAGE_SIZE } from "../utils/constants";
import { getToday } from "../utils/helpers";

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
