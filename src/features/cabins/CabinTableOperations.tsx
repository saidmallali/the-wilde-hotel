import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";

const filterOptions = [
  { label: "All", value: "all" },
  { label: "With discount", value: "with-discount" },
  { label: "No discount", value: "no-discount" },
];

const sortoptions = [
  { value: "name-asc", label: "Sort by name (A-Z)" },
  { value: "name-des", label: "Sort by name (Z-A)" },
  { value: "regularPrice-asc", label: "Sort by price (low first)" },
  { value: "regularPrice-des", label: "Sort by price (hight first)" },
  { value: "maxCapacity-asc", label: "Sort by capacity (low first)" },
  { value: "maxCapacity-des", label: "Sort by capacity (hight first)" },
];

const CabinTableOperations = () => {
  return (
    <TableOperations>
      <Filter filterField="discount" options={filterOptions} />
      <SortBy options={sortoptions} />
    </TableOperations>
  );
};

export default CabinTableOperations;
