import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";

const StyledFilter = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
`;

interface Props {
  active?: boolean;
}

const FilterButton = styled.button<Props>`
  background-color: var(--color-grey-0);
  border: none;

  ${(props) =>
    props.active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

export interface Option {
  value: string;
  label: string;
}

interface FilterProps {
  filterField: string;
  options: Option[];
}

const Filter = ({ filterField, options }: FilterProps) => {
  const [searchParams, setSearchparams] = useSearchParams();
  const searchValue = searchParams.get("discount");
  function handleClick(value: string) {
    searchParams.set(filterField, value);
    setSearchparams(searchParams);
  }

  return (
    <StyledFilter>
      {options.map((op) => (
        <FilterButton
          key={op.label}
          active={searchValue === op.value}
          onClick={() => handleClick(op.value)}
          disabled={searchValue === op.value}
        >
          {op.label}
        </FilterButton>
      ))}
    </StyledFilter>
  );
};

export default Filter;
