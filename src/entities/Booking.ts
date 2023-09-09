import { Cabin } from "./Cabin";
import { Geust } from "./Geust";

export interface Booking {
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  cabinPrice: number;
  extrasPrice: number;
  totalPrice: number;
  status: string;
  hasBreakfast: boolean;
  isPaid: boolean;
  observations: string;
  cabinID: number;
  guestID: number;
}

export interface BookingWithData extends Booking {
  cabins: Cabin;
  guests: Geust;
}
