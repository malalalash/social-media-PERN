import { CommentsData } from "../types";
import { dateFormat } from "../utils/dateFormat";
import { useUserStore } from "../store/userStore";
import { addComment } from "../api/comments/addComment";
import { deleteComment } from "../api/comments/deleteComment";
import { updateComment } from "../api/comments/updateComment";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { BsTrash } from "react-icons/bs";
import { LiaEdit } from "react-icons/lia";
import { IoClose } from "react-icons/io5";
import { BsCheck } from "react-icons/bs";
const Comments = ({
  comments,
  postId,
}: {
  comments: CommentsData;
  postId: number;
}) => {
  const user = useUserStore((state) => state.user);
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(0);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const deleteCommentMutation = useMutation(deleteComment, {
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const addCommentMutation = useMutation(addComment, {
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const updateCommentMutation = useMutation(updateComment, {
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content || !content.trim()) return;
    addCommentMutation.mutate({ content, postId });
    setContent("");
  };

  const handleDelete = (id: number) => {
    deleteCommentMutation.mutate(id);
  };

  const handleEditing = (id: number) => {
    if (editingCommentId === id) {
      setIsEditing(false);
      setEditingCommentId(0);
    } else {
      setEditingCommentId(id);
      setEditText(
        comments.comments.find((comment) => comment.id === id)?.content || ""
      );
    }
    setIsEditing(true);
  };

  const handleEditComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editText || !editText.trim()) return;
    updateCommentMutation.mutate({
      commentId: editingCommentId,
      description: editText,
    });
    setIsEditing(false);
    setEditText("");
    setEditingCommentId(0);
  };

  return (
    <section>
      <div className="mt-4 flex items-center justify-between gap-3 mb-5">
        <img
          src={user?.avatar}
          className="w-8 h-8 rounded-full object-cover"
          alt={`${user?.username} profile image`}
        />
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 w-full"
        >
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input input-sm w-full bg-base-200"
            name="comment"
            id="comment"
            autoComplete="off"
            placeholder="Write a comment"
          />
          <button
            disabled={loading}
            type="submit"
            className="btn btn-xs sm:btn-sm btn-neutral"
          >
            Add
          </button>
        </form>
      </div>
      {comments?.comments &&
        comments?.comments.map((comment) => (
          <div className="mt-2 mb-1" key={comment.id}>
            <div className="flex items-start gap-2">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={comment.avatar}
                alt={`${comment.username} profile image`}
              />
              <div className="bg-gray-100 w-full max-w-sm px-3 rounded-xl py-1">
                <div className="flex items-center justify-between">
                  <Link
                    to={`/user/${comment.user_id}`}
                    className="font-semibold text-xs sm:text-sm"
                  >
                    {comment.username}
                  </Link>
                  {user?.id === comment.user_id && (
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleEditing(comment.id)}
                        className="text-base pt-1 hover:transform hover:rotate-12 duration-150"
                      >
                        {isEditing && editingCommentId === comment.id ? (
                          <IoClose />
                        ) : (
                          <LiaEdit />
                        )}
                      </button>
                      <button
                        disabled={
                          isEditing && editingCommentId === comment.id
                            ? true
                            : false
                        }
                        onClick={() => handleDelete(comment.id)}
                        className="text-base pt-1 hover:transform hover:rotate-12 duration-150"
                      >
                        <BsTrash />
                      </button>
                    </div>
                  )}
                </div>
                {isEditing && editingCommentId === comment.id ? (
                  <form
                    onSubmit={handleEditComment}
                    className="relative flex items-center justify-between w-full"
                  >
                    <input
                      className="input input-xs sm:input-sm w-full my-1"
                      type="text"
                      autoComplete="off"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button disabled={loading} className="absolute right-0 p-2">
                      <BsCheck style={{ color: "green" }} size={22} />
                    </button>
                  </form>
                ) : (
                  <p className="text-xs sm:text-sm">{comment.content}</p>
                )}
              </div>
            </div>
            <div className="ml-10">
              <span className="text-xs text-gray-600">
                {dateFormat(comment.created_at)}
              </span>
            </div>
          </div>
        ))}
    </section>
  );
};

export default Comments;
