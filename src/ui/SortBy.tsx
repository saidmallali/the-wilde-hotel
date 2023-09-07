import { useSearchParams } from "react-router-dom";
import { Option } from "./Filter";
import Select from "./Select";

interface Props {
  options: Option[];
}

function SortBy({ options }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "";

  const handelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    searchParams.set("sortBy", e.target.value);
    setSearchParams(searchParams);
  };
  return (
    <div>
      <Select
        onChange={(e) => handelChange(e)}
        type="white"
        options={options}
        value={sortBy}
      />
    </div>
  );
}

export default SortBy;
