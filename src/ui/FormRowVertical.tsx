import { ReactNode } from "react";
import styled from "styled-components";

const StyledFormRow = styled.div`
  display: flex;
  flex-direction: column;

  gap: 0.8rem;
  padding: 1.2rem 0;
`;

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

interface Props {
  label?: string;
  children: ReactNode;
  htmlFor?: string;
  error?: string;
}

const FormRowVertical = ({ label, children, htmlFor, error }: Props) => {
  return (
    <StyledFormRow>
      {" "}
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {error && <Error>{error}</Error>}
    </StyledFormRow>
  );
};

export default FormRowVertical;
