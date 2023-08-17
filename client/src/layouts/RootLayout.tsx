import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Header";
import { useUserStore } from "../store/userStore";
import Footer from "../components/Footer";

const RootLayout = () => {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/");
  }, []);
  return (
    <>
      {user && <Header />}
      <Outlet />
      <Footer />
    </>
  );
};

export default RootLayout;
