import { fetcher } from "@/lib/fetcher";
import { deleteComment } from "@/services/comments";
import { Comment } from "@/types/comments";
import { ParamValue } from "next/dist/server/request/params";
import { toast } from "sonner";
import useSWR from "swr";

const useComments = (taskId?: ParamValue) => {
  const {
    data: comments,
    error: commentsError,
    isLoading: areCommentsLoading,
    mutate,
  } = useSWR<Comment[], Error>(
    taskId ? `/api/tasks/${taskId}/comments` : null,
    fetcher,
    {
      errorRetryCount: 0,
    }
  );

  const handleEditComment = () => {};

  const handleNewCommentSubmission = () => {};

  const handleDeleteComment = async (comment: Comment) => {
    try {
      await deleteComment(comment.id);
      mutate(
        (currentComments = []) =>
          currentComments.filter((_c) => _c.id !== comment.id),
        false
      );
      toast(`Comment was successfully deleted!`);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred, your comment could not be deleted.");
    }
  };

  return {
    comments,
    commentsError,
    areCommentsLoading,
    handleEditComment,
    handleDeleteComment,
    handleNewCommentSubmission,
  };
};

export default useComments;
