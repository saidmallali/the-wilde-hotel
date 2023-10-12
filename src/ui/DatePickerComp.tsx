import DatePicker from "react-datepicker";
import { SetStateAction } from "react";

import "react-datepicker/dist/react-datepicker.css";
import Input from "./Input";

interface Props {
  initialDate: Date;
  onchange: (date: SetStateAction<Date>) => void;
}

const DatePickerComp = ({ initialDate, onchange }: Props) => {
  // const [initialDate, setInitialDate] = useState(new Date());
  // onChange={(date) => setInitialDate(date as SetStateAction<Date>)}
  return (
    <DatePicker
      showIcon
      selected={initialDate}
      onChange={(date) => onchange(date as SetStateAction<Date>)}
      customInput={<Input />}
    />
  );
};

export default DatePickerComp;
