import { useUserStore } from "../store/userStore";
import { Navigate } from "react-router-dom";
import Posts from "../components/posts/Posts";
import CreatePost from "../components/posts/CreatePost";
const Home = () => {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <main className="container mx-auto max-w-3xl my-10 min-h-screen">
      <CreatePost />
      <Posts />
    </main>
  );
};

export default Home;
