import { FaRegCommentDots } from "react-icons/fa";
import { FaRegThumbsUp } from "react-icons/fa";
import { FaThumbsUp } from "react-icons/fa";
import { likePost } from "../api/likes/likePost";
import { dislikePost } from "../api/likes/dislikePost";
import { LikeType, PostType } from "../types";
import { getLikes } from "../api/likes/getLikes";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { useUserStore } from "../store/userStore";
import { CommentsData } from "../types";
import { useState } from "react";
const LikesAndCommentsBar = ({
  post,
  handleOpenComments,
}: {
  post: PostType;
  handleOpenComments: () => void;
}) => {
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data } = useQuery(["likes", post.id], () => getLikes(post.id), {
    enabled: !!post.id,
  });
  const liked = data?.likes.some((like: LikeType) => like.user_id === user?.id);

  const comments = queryClient.getQueryData<CommentsData>([
    "comments",
    post.id,
  ]);

  const likeMutation = useMutation(likePost, {
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["likes", post.id]);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
  const dislikeMutation = useMutation(dislikePost, {
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["likes", post.id]);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleLike = () => {
    if (liked) {
      dislikeMutation.mutate(post.id);
    } else {
      likeMutation.mutate(post.id);
    }
  };

  return (
    <div>
      <ul className="py-2 flex gap-5 justify-between text-sm sm:text-base border-y">
        <li className="cursor-pointer flex gap-2">
          <button
            disabled={loading}
            className="flex items-center gap-2 transform duration-200 hover:bg-base-200 p-1 rounded-full px-2"
            onClick={handleLike}
          >
            <span className="text-base">
              {liked ? (
                <FaThumbsUp size={20} style={{ color: "blue" }} />
              ) : (
                <FaRegThumbsUp size={20} />
              )}
            </span>
            {data?.likes.length} {data?.likes.length === 1 ? "Like" : "Likes"}
          </button>
        </li>
        <li className="cursor-pointer flex items-center gap-2">
          <button
            disabled={loading}
            onClick={handleOpenComments}
            className="flex items-center gap-2 transform duration-200 hover:bg-base-200 p-1 rounded-full px-2"
          >
            <span className="text-base">
              <FaRegCommentDots size={20} />
            </span>
            {comments?.comments?.length || "0"}{" "}
            {comments?.comments?.length === 1 ? "Comment" : "Comments"}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default LikesAndCommentsBar;
