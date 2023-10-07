import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { BookingWithData } from "../../entities/Booking";
import Stat from "./Stat";
import { formatCurrency } from "../../utils/helpers";

type BookingStat = {
  created_at: string;
  totalPrice: number;
  extrasPrice: number;
};
interface StatsProps {
  bookings: BookingStat[];
  confirmedStays: BookingWithData[];
  numDays: number;
  cabinCount: number;
}
const Stats = ({
  bookings,
  confirmedStays,
  numDays,
  cabinCount,
}: StatsProps) => {
  // number of bookings
  const numBookings = bookings?.length;

  // totale sales

  const sales = bookings?.reduce((acc, cur) => acc + cur.totalPrice, 0);
  // total check ins

  const checkins = confirmedStays?.length;

  // occupation rate : number of checked nights / all available nights(num days * num cabins)

  const occupation =
    confirmedStays?.reduce((acc, cur) => acc + cur.numNights, 0) /
    (numDays * cabinCount);

  return (
    <>
      <Stat
        title="Bookings"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={numBookings}
      />
      <Stat
        title="Sales"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(sales)}
      />
      <Stat
        title="Check ins"
        color="indigo"
        icon={<HiOutlineCalendar />}
        value={checkins}
      />
      <Stat
        title="Occupancy rate"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value={Math.round(occupation * 100) + "%"}
      />
    </>
  );
};

export default Stats;
