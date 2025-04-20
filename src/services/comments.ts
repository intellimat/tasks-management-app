import { fetcher } from "@/lib/fetcher";

export async function deleteComment(commentId: number) {
  return fetcher<{ deletedComment: Comment }>(`/api/comments/${commentId}`, {
    method: "DELETE",
  });
}
