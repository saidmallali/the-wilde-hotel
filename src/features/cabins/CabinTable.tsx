import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import { useCabins } from "./useCabins";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

const CabinTable = () => {
  const { cabins, isLoading, error } = useCabins();

  if (isLoading) return <Spinner />;

  if (error) {
    throw new Error("something wrong...");
  }
  console.log(cabins);

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
          data={cabins}
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
