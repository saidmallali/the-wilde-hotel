import styled, { css } from "styled-components";

interface Props {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const Heading = styled.h1<Props>`
  ${(props) =>
    props.as === "h1" &&
    css`
      font-size: 20px;
      font-weight: 600;
    `}

  ${(props) =>
    props.as === "h2" &&
    css`
      font-size: 2rem;
      font-size: 500;
    `}

  ${(props) =>
    props.as === "h3" &&
    css`
      font-size: 2rem;
      font-size: 500;
    `}
  ${(props) =>
    props.as === "h4" &&
    css`
      font-size: 3rem;
      font-size: 600;
      text-align: center;
    `}

    line-height:1.4
`;

export default Heading;
