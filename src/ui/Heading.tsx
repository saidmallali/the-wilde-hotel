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
      font-size: 18px;
      font-size: 500;
    `}

  ${(props) =>
    props.as === "h3" &&
    css`
      font-size: 18px;
      font-size: 500;
    `}

    line-height:1.4
`;

export default Heading;
