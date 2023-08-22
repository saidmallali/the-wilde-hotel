import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  type?: string;
}

const Row = ({ children }: Props) => {
  return <div>{children}</div>;
};

export default Row;
