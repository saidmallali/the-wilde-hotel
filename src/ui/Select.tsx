import styled from "styled-components";
import { Option } from "./Filter";

interface Props {
  type?: string;
}

const StyledSelect = styled.select<Props>`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

interface SelectProps {
  options: Option[];
  value?: string;
  type: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select = ({ type, options, onChange, value }: SelectProps) => {
  return (
    <StyledSelect onChange={(e) => onChange(e)} type={type} value={value}>
      {options.map((op) => (
        <option key={op.value} value={op.value}>
          {op.label}
        </option>
      ))}
    </StyledSelect>
  );
};

export default Select;
