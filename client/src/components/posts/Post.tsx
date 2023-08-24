import { BsThreeDots } from "react-icons/bs";
import { PostType } from "../../types";
import { useUserStore } from "../../store/userStore";
import { AiOutlineClose } from "react-icons/ai";
import { dateFormat } from "../../utils/dateFormat";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { deletePost } from "../../api/posts/deletePost";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getComments } from "../../api/comments/getComments";
import Comments from "../Comments";
import UpdatePostModal from "./UpdatePostModal";
import { AnimatePresence, motion } from "framer-motion";
import LikesAndCommentsBar from "../LikesAndCommentsBar";

const Post = ({ post }: { post: PostType }) => {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const { data: comments } = useQuery(
    ["comments", post.id],
    () => getComments(post.id),
    {
      enabled: !!post.id,
    }
  );

  const [openComments, setOpenComments] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const deletePostMutation = useMutation(deletePost, {
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

  const handleDelete = () => {
    deletePostMutation.mutate({
      id: post.id,
      public_id: post.public_id,
    });
  };

  const handleOpenModal = () => {
    openUpdateModal
      ? (document.body.style.overflowY = "auto")
      : (document.body.style.overflowY = "hidden");
    setOpenUpdateModal(!openUpdateModal);
  };

  const handleOpenImage = () => {
    openImage
      ? (document.body.style.overflowY = "auto")
      : (document.body.style.overflowY = "hidden");
    setOpenImage(!openImage);
  };
  const handleOpenComments = () => {
    setOpenComments(!openComments);
  };
  if (post && user)
    return (
      <>
        <div className="p-5 pb-3 relative mt-10 shadow-lg border-t border-t-gray-200/60 outline-2 outline-gray-50 rounded-3xl mx-5 md:mx-0 dark:border-none dark:bg-gray-800 dark:shadow-none">
          <div className="flex items-center border-gray-200 gap-5 pb-3">
            <img
              src={post.avatar}
              alt={`${post.username} profile image`}
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <Link
                to={`/user/${post.user_id}`}
                className="font-semibold sm:text-xl"
              >
                {post.username}
              </Link>
              <span className="text-gray-500 text-xs">
                {dateFormat(post.created_at)}
              </span>
            </div>
          </div>
          <p className="py-2 pb-4 md:text-lg">{post.description}</p>
          {post.img && (
            <div
              onClick={handleOpenImage}
              className="overflow-hidden max-h-80 cursor-pointer w-full mb-3"
            >
              <img
                src={post.img}
                alt="post image"
                className="object-center mx-auto w-full h-full"
              />
            </div>
          )}
          <AnimatePresence>
            {openImage && post.img && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`bg-black/50 z-50 w-full h-full fixed flex justify-center items-center top-0 left-0`}
              >
                <img
                  src={post.img}
                  alt="post image"
                  className="max-w-full max-h-full object-contain sm:p-5"
                />
                <button
                  className="absolute top-0 mt-[72px] right-0 text-white p-3 bg-black/50"
                  onClick={handleOpenImage}
                >
                  <AiOutlineClose size={30} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {user.id === post.user_id && (
            <div className="dropdown dropdown-end absolute right-0 top-0 pt-5 pr-5">
              <label tabIndex={0} className="cursor-pointer dark:hover:text-white">
                <BsThreeDots size={25} />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] gap-1 mr-5 menu p-2 shadow bg-base-100 rounded-box w-36"
              >
                <li>
                  <button disabled={loading} onClick={handleOpenModal}>
                    Edit Post
                  </button>
                </li>
                <li>
                  <button disabled={loading} onClick={handleDelete}>
                    Delete post
                  </button>
                </li>
              </ul>
            </div>
          )}
          <LikesAndCommentsBar
            post={post}
            handleOpenComments={handleOpenComments}
          />
          {openComments && <Comments comments={comments} postId={post.id} />}
        </div>
        {openUpdateModal && (
          <UpdatePostModal
            setLoading={setLoading}
            handleOpenModal={handleOpenModal}
            post={post}
          />
        )}
      </>
    );
};

export default Post;
