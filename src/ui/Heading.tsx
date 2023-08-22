import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  as: "h3" | "h1" | "h2" | "h4" | "h5";
}

const Heading = ({ children }: Props) => {
  return <div>{children}</div>;
};

export default Heading;
