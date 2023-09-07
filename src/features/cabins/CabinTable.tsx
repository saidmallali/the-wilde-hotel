import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import { useCabins } from "./useCabins";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";

const CabinTable = () => {
  const { cabins, isLoading, error } = useCabins();
  const [searchParams] = useSearchParams();
  const filterValue = searchParams.get("discount") || "all";
  if (isLoading) return <Spinner />;

  if (error) {
    throw new Error("something wrong...");
  }

  //FILTER

  let filtredCabins;
  if (filterValue === "all") filtredCabins = cabins;
  if (filterValue === "with-discount")
    filtredCabins = cabins?.filter((cb) => cb.dicount > 0);
  if (filterValue === "no-discount")
    filtredCabins = cabins?.filter((cb) => cb.dicount === 0);

  //Sorting
  const sortByValue = searchParams.get("sortBy") || "name-asc";
  const [field, direction] = sortByValue.split("-");
  const modifier = direction === "asc" ? 1 : -1;
  const sortedCabins = filtredCabins?.sort(
    (a, b) => (a[field] - b[field]) * modifier
  );

  return (
    <Menus>
      <Table columns=" 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
        </Table.Header>
        <Table.Body
          data={sortedCabins}
          render={(cabin) => <CabinRow cabinItem={cabin} key={cabin.id} />}
        />
        {/* {cabins?.map((cabin) => (
        <CabinRow cabinItem={cabin} key={cabin.id} />
      ))} */}
      </Table>
    </Menus>
  );
};

export default CabinTable;
