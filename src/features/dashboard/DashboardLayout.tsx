import styled from "styled-components";
import { useRecentBookings } from "./useRecentBookings";
import Spinner from "../../ui/Spinner";
import { useRecentStays } from "./useRecentStays";
import Stats from "./Stats";
import { useCabins } from "../cabins/useCabins";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import TodayActivity from "../check-in-out/TodayActivity";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const { bookings, isLoading: isloadingRecentBookings } = useRecentBookings();
  const {
    isLoading: isloadingRecentStays,
    confirmedStays,
    numDays,
  } = useRecentStays();

  const { cabins, isLoading: isLoadingcabins } = useCabins();

  if (isloadingRecentBookings || isloadingRecentStays || isLoadingcabins)
    return <Spinner />;
  return (
    <StyledDashboardLayout>
      {bookings && confirmedStays && cabins && (
        <Stats
          numDays={numDays}
          bookings={bookings}
          cabinCount={cabins?.length}
          confirmedStays={confirmedStays}
        />
      )}
      <TodayActivity />
      {confirmedStays && <DurationChart confirmedStays={confirmedStays} />}
      {bookings && <SalesChart bookings={bookings} numDays={numDays} />}
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
