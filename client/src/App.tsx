import { useQuery } from "react-query";
import { Navigate } from "react-router-dom";
import { useUserStore } from "./store/userStore";
import checkAuth from "./api/user/authUser";
import Spinner from "./components/Spinner";

const App = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const { isLoading } = useQuery("user", checkAuth, {
    onSuccess: (data) => {
      if (data.message === "Unauthorized") {
        setUser(null);
      } else {
        setUser(data);
      }
    },
  });

  if (isLoading) return <Spinner />;

  if (!user) return <Navigate to="/login" />;

  return <Navigate to="home" />;
};

export default App;
