import { useUserStore } from "../store/userStore";
import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { getUser } from "../api/user/getUser";
import Spinner from "../components/Spinner";
import Post from "../components/posts/Post";
import { PostType } from "../types";
import { getUserPosts } from "../api/posts/getUserPosts";

const UserProfile = () => {
  const user = useUserStore((state) => state.user);
  const { userId } = useParams();
  const userIdNumber = Number(userId);

  if (user?.id === userIdNumber) {
    return <Navigate to="/profile" />;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data, isLoading } = useQuery(["userProfile", userIdNumber], () =>
    getUser(userIdNumber)
  );

  const { data: userPosts } = useQuery(["userPosts", userIdNumber], () =>
    getUserPosts(userIdNumber)
  );

  if (isLoading) {
    return <Spinner />;
  }
  const profile = data?.userData;

  return (
    <main className="min-h-screen">
      <div className="w-full top-2 mt-16 h-48 sm:h-72 absolute border-b bg-black/20 left-0">
        <img src={profile?.bg_img} className="w-full h-full object-cover" />
      </div>
      <div className="max-w-xl relative mx-10 sm:mx-auto pt-10 pb-5 mt-20 sm:mt-32 bg-transparent border-b">
        <div className="flex flex-col items-center justify-center gap-1 sm:gap-3">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36">
            <img
              src={profile?.avatar}
              alt={`${profile?.username} profile image`}
              className="w-full h-full object-cover object-center border-4 border-base-100 rounded-full"
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-bold text-center text-2xl sm:text-4xl">
              {profile?.username}
            </h1>
            <h2 className="text-gray-500 text-base sm:text-lg">
              {profile?.email}
            </h2>
          </div>
        </div>
      </div>
      <section>
        <h3 className="text-2xl text-center pt-10 font-semibold">
          {profile.username}'s last activity
        </h3>
        {userPosts?.posts?.length > 0 ? (
          userPosts?.posts?.map((post: PostType) => {
            return (
              <article
                className="mb-10 container max-w-3xl mx-auto"
                key={post.id}
              >
                <Post post={post} />
              </article>
            );
          })
        ) : (
          <h1 className="text-2xl mt-16 text-center font-semibold uppercase">
            Nothing to see here... &#128534;
          </h1>
        )}
      </section>
    </main>
  );
};

export default UserProfile;
