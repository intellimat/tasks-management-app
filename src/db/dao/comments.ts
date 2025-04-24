import { eq } from "drizzle-orm";
import { db } from "..";
import { comments } from "../schema/comments";
import { users } from "../schema/users";
import { CommentFormData, Id } from "@/types/zod";

export async function fetchComments(taskId: number) {
  const rows = await db
    .select({
      id: comments.id,
      taskId: comments.taskId,
      content: comments.content,
      createdAt: comments.createdAt,
      authorId: users.id,
      authorEmail: users.email,
    })
    .from(comments)
    .where(eq(comments.taskId, taskId))
    .leftJoin(users, eq(comments.authorId, users.id));

  const parsedComments = rows.map((row) => ({
    ...row,
    author: {
      id: row.authorId,
      email: row.authorEmail,
    },
  }));

  return parsedComments;
}

export async function deleteCommentById(commentId: number) {
  const [deletedComment] = await db
    .delete(comments)
    .where(eq(comments.id, commentId))
    .returning();

  if (!deletedComment) {
    return null;
  }

  return deletedComment;
}

export async function updateComment(
  commentId: number,
  comment: CommentFormData
) {
  const [udpatedComment] = await db
    .update(comments)
    .set({ content: comment.content })
    .where(eq(comments.id, commentId))
    .returning();

  if (!udpatedComment) {
    return null;
  }

  return udpatedComment;
}

export async function addComment(
  comment: CommentFormData & {
    taskId: Id;
    authorId: Id;
  }
) {
  const [insertedComment] = await db
    .insert(comments)
    .values(comment)
    .returning();

  if (!insertedComment) {
    return null;
  }

  return insertedComment;
}
