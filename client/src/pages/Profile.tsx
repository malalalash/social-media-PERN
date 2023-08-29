import { useUserStore } from "../store/userStore";
import { BsCameraFill, BsCheckLg } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { updateAvatar } from "../api/user/updateAvatar";
import { updateBg } from "../api/user/updateBg";
import { FiEdit, FiTrash } from "react-icons/fi";
import { fileReader } from "../utils/fileReader";
import UpdateProfileModal from "../components/UpdateProfileModal";
import { PostType } from "../types";
import { getUserPosts } from "../api/posts/getUserPosts";
import Post from "../components/posts/Post";
import Spinner from "../components/Spinner";
import { getFollowers } from "../api/relationships/getFollowers";
import { getFollowed } from "../api/relationships/getFollowed";

const Profile = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [image, setImage] = useState("");
  const [bgImage, setBgImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: userPosts, isLoading } = useQuery(["myPosts", user?.id], () =>
    getUserPosts(user?.id!)
  );
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: followers } = useQuery(["followers", user?.id], () =>
    getFollowers(user?.id!)
  );

  const { data: following } = useQuery(["following", user?.id], () =>
    getFollowed(user?.id!)
  );

  const avatarMutation = useMutation(updateAvatar, {
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      if (user) {
        const updatedUser = { ...user, avatar: image };
        setUser(updatedUser);
      }
      queryClient.invalidateQueries("user");
      queryClient.invalidateQueries("myPosts");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const bgMutation = useMutation(updateBg, {
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      if (user) {
        const updatedUser = { ...user, bg_img: bgImage };
        setUser(updatedUser);
      }
      queryClient.invalidateQueries("user");
      queryClient.invalidateQueries("myPosts");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleModal = () => {
    openModal
      ? (document.body.style.overflowY = "auto")
      : (document.body.style.overflowY = "hidden");
    setOpenModal(!openModal);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    const name = e.target.name;
    if (file) {
      fileReader(file)
        .then((result) => {
          if (name === "bg") {
            setBgImage(result);
          } else {
            setImage(result);
          }
          e.target.value = "";
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image && !bgImage) {
      return;
    }
    if (image) {
      avatarMutation.mutate({ image });
    } else {
      bgMutation.mutate({ image: bgImage });
    }
    setBgImage("");
    setImage("");
  };

  const handleCancel = () => {
    setImage("");
    setBgImage("");
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <main className="min-h-screen">
      <div className="w-full h-48 top-2 mt-16 sm:h-72 absolute border-b bg-black/20 left-0">
        <img src={user?.bg_img} className="w-full h-full object-cover" />
        {bgImage && (
          <img
            src={bgImage}
            className="w-full absolute top-0 h-full object-cover"
          />
        )}
        <form id="bg" onSubmit={handleSubmit}>
          <label
            className="focus:outline focus:outline-blue-600"
            htmlFor="bgImg"
          >
            <span className="absolute z-40 m-3 text-black cursor-pointer sm:text-xl text-sm transform duration-200 hover:text-white hover:bg-black top-0 right-[-5px] sm:right-0 bg-white rounded-full p-2 border-2">
              <BsCameraFill />
            </span>
          </label>
          <input
            onChange={handleChange}
            accept="image/png, image/jpeg, image/jpg"
            type="file"
            name="bg"
            id="bgImg"
            className="hidden"
            disabled={image ? true : false}
          />
        </form>
        <div className="absolute z-50 bottom-0 right-[-5px] sm:right-0 m-3 flex flex-col sm:flex-row gap-2">
          {(image || bgImage) && (
            <button
              onClick={handleCancel}
              className=" text-black cursor-pointer sm:text-xl text-sm transform duration-200 hover:text-white hover:bg-black bg-white rounded-full p-2 border-2"
            >
              <FiTrash />
            </button>
          )}
          {(image || bgImage) && (
            <button
              type="submit"
              form={image ? "avatar" : "bg"}
              className=" text-black cursor-pointer sm:text-xl text-sm transform duration-200 hover:text-white hover:bg-black  bg-white rounded-full p-2 border-2"
            >
              <BsCheckLg />
            </button>
          )}
        </div>
      </div>
      <div className="max-w-xl relative mx-10 sm:mx-auto border-b py-10 mt-20 sm:mt-32 bg-transparent">
        <div className="flex flex-col items-center justify-center gap-1 sm:gap-3">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36">
            {loading && (
              <div className="absolute rounded-full flex items-center justify-center bg-black/50 w-full h-full">
                <span className="loading loading-spinner loading-lg text-white"></span>
              </div>
            )}
            <img
              src={user?.avatar}
              alt={`${user?.username} profile image`}
              className="w-full h-full object-cover object-center border-4 border-base-100 rounded-full"
            />
            <form id="avatar" onSubmit={handleSubmit}>
              <label htmlFor="avatarImg">
                {image ? (
                  <img
                    src={image}
                    className="rounded-full object-cover border w-10 h-10 top-0 right-0 absolute cursor-pointer"
                  />
                ) : (
                  <span className="absolute text-black cursor-pointer sm:text-xl text-sm transform duration-200 hover:text-white hover:bg-black top-0 right-[-5px] sm:right-0 bg-white rounded-full p-2 border-2">
                    <BsCameraFill />
                  </span>
                )}
              </label>
              <input
                onChange={handleChange}
                accept="image/png, image/jpeg, image/jpg"
                type="file"
                name="avatar"
                id="avatarImg"
                className="hidden"
                disabled={bgImage ? true : false}
              />
            </form>
            <button
              onClick={handleModal}
              className="absolute text-black text-sm cursor-pointer transform duration-200 hover:text-white hover:bg-black bottom-0 right-[-5px] bg-white rounded-full p-2 sm:hidden border-2"
            >
              <FiEdit />
            </button>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-bold text-center text-2xl sm:text-4xl">
              {user?.username}
            </h1>
            <h2 className="text-gray-500 text-base sm:text-lg">
              {user?.email}
            </h2>
            <button
              onClick={handleModal}
              className="btn btn-neutral btn-sm hidden sm:block dark:hover:text-white"
            >
              Edit Profile
            </button>
            <div className="flex items-center justify-between gap-10 text-xs sm:text-base">
              <p className="flex flex-col items-center justify-center">
                <span className="font-semibold text-base sm:text-lg">
                  {followers?.followers.length}
                </span>{" "}
                followers
              </p>
              <p className="flex flex-col items-center justify-center">
                <span className="font-semibold text-base sm:text-lg">
                  {following?.following.length}
                </span>{" "}
                following
              </p>
            </div>
          </div>
        </div>
      </div>
      {openModal && <UpdateProfileModal handleModal={handleModal} />}
      <section>
        <h3 className="text-2xl text-center pt-10 font-semibold">
          Last activity
        </h3>
        {userPosts.posts ? (
          userPosts.posts.map((post: PostType) => {
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

export default Profile;
