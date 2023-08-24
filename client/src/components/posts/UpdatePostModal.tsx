import { PostType } from "../../types";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { useQueryClient, useMutation } from "react-query";
import { updatePost } from "../../api/posts/updatePost";

const UpdatePostModal = ({
  post,
  handleOpenModal,
  setLoading,
}: {
  post: PostType;
  handleOpenModal: () => void;
  setLoading: (loading: boolean) => void;
}) => {
  const [text, setText] = useState(post.description);
  const queryClient = useQueryClient();

  const updatePostMutation = useMutation(updatePost, {
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
      queryClient.invalidateQueries("myPosts");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text || !text.trim() || text === post.description) return;
    updatePostMutation.mutate({
      postId: post.id,
      description: text,
    });
    handleOpenModal();
  };
  return (
    <div className="w-full min-h-screen top-0 left-0 fixed z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white container max-w-2xl mx-5 p-5 rounded-xl shadow-xl dark:bg-gray-800">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-xl sm:text-2xl dark:text-gray-300">Edit Post</h3>
          <button
            className="text-xl text-gray-500 dark:text-gray-400"
            onClick={handleOpenModal}
          >
            <IoClose />
          </button>
        </div>
        <form id="update" onSubmit={handleUpdate} className="py-5 border-b">
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="bg-gray-100 w-full focus:outline-none focus:outline-gray-300 rounded-lg p-3 resize-none dark:bg-gray-900 dark:focus:outline-gray-950 dark:text-gray-200"
          ></textarea>
        </form>
        <div className="flex items-center justify-end mt-5 gap-5">
          <button
            onClick={handleOpenModal}
            className="btn-sm btn sm:btn-md btn-error"
          >
            Close
          </button>
          <button
            form="update"
            type="submit"
            className="btn-sm btn sm:btn-md btn-success"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePostModal;
