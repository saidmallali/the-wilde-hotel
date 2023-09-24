import { ReactNode, useEffect } from "react";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
interface Props {
  children: ReactNode;
}

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-gery-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProtectedRoute = ({ children }: Props) => {
  const navigate = useNavigate();

  //1.load the authenticated user

  const { isLoading, isAuthenticated } = useUser();

  //3 if there is No authenticated user redirect to the login
  useEffect(() => {
    if (!isAuthenticated && isLoading) navigate("/login");
  }, [isAuthenticated, isLoading, navigate]);
  //2 while loading show a spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  //4 if there is a user render the app

  if (isAuthenticated) return children;
};

export default ProtectedRoute;
