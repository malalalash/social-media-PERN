import { useUserStore } from "../../store/userStore";
import { RiImageAddFill } from "react-icons/ri";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { addPost } from "../../api/posts/addPost";
import { FaTrash } from "react-icons/fa";
import { fileReader } from "../../utils/fileReader";
const CreatePost = () => {
  const user = useUserStore((state) => state.user);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation(addPost, {
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description || !description.trim()) {
      return;
    }
    mutation.mutate({
      description,
      image: image || null,
    });
    setDescription("");
    setImage("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      fileReader(file)
        .then((result) => {
          setImage(result);
          e.target.value = "";
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
  const handleDelete = () => {
    setImage("");
  };
  return (
    <div className="p-5 relative shadow-lg border-t border-t-gray-200/60 rounded-3xl mx-5 md:mx-0 dark:bg-gray-800 dark:border-none dark:shadow-none">
      <div className="flex items-center border-b border-gray-200 gap-5 pb-3">
        <img
          src={user?.avatar}
          alt={`${user?.username} profile image`}
          className="w-10 h-10 md:w-14 md:h-14 object-cover rounded-full dark:outline-none"
        />
        <form id="share" onSubmit={handleSubmit} className="w-full">
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            autoComplete="off"
            className="w-full rounded-full p-2 px-3 border-none md:text-lg placeholder:text-sm sm:placeholder:text-base dark:bg-transparent  focus:outline dark:focus:outline-gray-700 dark:text-white"
            placeholder={`What's on your mind ${user?.username}?`}
          />
        </form>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <input
            accept="image/png, image/jpeg, image/gif, image/jpg"
            onChange={handleChange}
            type="file"
            id="file"
            className="hidden"
          />
          <label
            htmlFor="file"
            className="flex items-center cursor-pointer gap-2 text-gray-500 hover:text-black dark:hover:text-white"
          >
            {image ? (
              <img src={image} className="w-8 h-8" />
            ) : (
              <div className="flex items-center gap-2">
                <RiImageAddFill size={25} />
                <span className="pt-1 text-sm font-semibold">Add Image</span>
              </div>
            )}
          </label>
          {image && (
            <button
              onClick={handleDelete}
              className="text-gray-500 hover:text-black dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 p-2 text-sm font-semibold"
            >
              <FaTrash size={19} />
            </button>
          )}
        </div>
        <button
          disabled={loading}
          type="submit"
          form="share"
          className="btn btn-xs sm:btn-sm btn-primary dark:btn-neutral dark:hover:text-white"
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
