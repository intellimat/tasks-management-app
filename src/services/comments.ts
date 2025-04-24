import { fetcher } from "@/lib/fetcher";
import { Comment } from "@/types/comments";
import { CommentFormData } from "@/types/zod";

export async function deleteComment(commentId: number) {
  return fetcher<{ deletedComment: Comment }>(`/api/comments/${commentId}`, {
    method: "DELETE",
  });
}

export async function updateComment(
  commentId: number,
  commentData: CommentFormData
) {
  return fetcher<{ updatedComment: Comment }>(`/api/comments/${commentId}`, {
    method: "PUT",
    body: commentData,
  });
}
export async function postComment(
  taskId: number,
  commentData: CommentFormData
) {
  return fetcher<{ updatedComment: Comment }>(`/api/tasks/${taskId}/comments`, {
    method: "POST",
    body: commentData,
  });
}
