import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../store/userStore";
const PrivateRoute = () => {
  const user = useUserStore((state) => state.user);
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
