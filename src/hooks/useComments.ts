import { fetcher } from "@/lib/fetcher";
import { deleteComment, postComment, updateComment } from "@/services/comments";
import { Comment } from "@/types/comments";
import { commentSchemaValidator } from "@/types/zod";
import { ParamValue } from "next/dist/server/request/params";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { z } from "zod";

const useComments = (
  setEditingId: Dispatch<SetStateAction<number | null>>,
  taskId?: ParamValue
) => {
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

  const handleEditComment = async (comment: Comment) => {
    const commentData = commentSchemaValidator.parse(comment); // strip extra properties
    try {
      await updateComment(comment.id, commentData);
      setEditingId(null);
      toast.success("Comment successfully updated!");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred, selected comment could not be updated. ");
    }
    mutate();
  };

  const handleNewCommentSubmission = async (
    taskId: number,
    newComment: z.infer<typeof commentSchemaValidator>
  ) => {
    try {
      await postComment(taskId, newComment);
      toast.success("New Comment was added successfully!");
      mutate();
    } catch (error) {
      console.error(error);
      toast.error("Error: New Comment could not be added. ");
    }
  };

  const handleDeleteComment = async (comment: Comment) => {
    try {
      await deleteComment(comment.id);
      mutate(
        (currentComments = []) =>
          currentComments.filter((_c) => _c.id !== comment.id),
        false
      );
      toast.success(`Comment was successfully deleted!`);
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
