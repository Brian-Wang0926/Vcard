import { Outlet } from "react-router-dom";
import Nav from "./nav-component";
import useUserStore from "../stores/userStore";

const Layout = () => {
  const { currentUser } = useUserStore();
  return (
    <>
      <Nav currentUser={currentUser} />
      <Outlet />
    </>
  );
};

export default Layout;
