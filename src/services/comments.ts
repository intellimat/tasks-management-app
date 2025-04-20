import { fetcher } from "@/lib/fetcher";
import { Comment } from "@/types/comments";
import { commentSchemaValidator } from "@/types/zod";
import { z } from "zod";

export async function deleteComment(commentId: number) {
  return fetcher<{ deletedComment: Comment }>(`/api/comments/${commentId}`, {
    method: "DELETE",
  });
}

export async function updateComment(
  commentId: number,
  commentData: z.infer<typeof commentSchemaValidator>
) {
  return fetcher<{ updatedComment: Comment }>(`/api/comments/${commentId}`, {
    method: "PUT",
    body: commentData,
  });
}
