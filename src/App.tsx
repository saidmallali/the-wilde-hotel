import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Cabins from "./pages/Cabins";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import PageNotFound from "./pages/PageNotFound";
import Users from "./pages/Users";
import GlobalStyles from "./styles/GlobalStyles";
import Login from "./pages/Login";
import AppLayout from "./ui/AppLayout";

const App = () => {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/cabins" element={<Cabins />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account" element={<Account />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
