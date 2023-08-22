import { styled } from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";

const StyledApp = styled.main`
  padding: 20px;
  color: var(--color-brand-800);
`;

const App = () => {
  return (
    <>
      <GlobalStyles />
      <StyledApp>App</StyledApp>
    </>
  );
};

export default App;
