import { eq } from "drizzle-orm";
import { db } from "..";
import { comments } from "../schema/comments";
import { users } from "../schema/users";
import { commentSchemaValidator, idValidator } from "@/types/zod";
import { z } from "zod";

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

  return deletedComment;
}

export async function updateComment(
  commentId: number,
  comment: z.infer<typeof commentSchemaValidator>
) {
  const [udpatedComment] = await db
    .update(comments)
    .set({ content: comment.content })
    .where(eq(comments.id, commentId))
    .returning();

  return udpatedComment;
}

export async function addComment(
  comment: z.infer<typeof commentSchemaValidator> & {
    taskId: z.infer<typeof idValidator>;
    authorId: z.infer<typeof idValidator>;
  }
) {
  const [insertedComment] = await db
    .insert(comments)
    .values(comment)
    .returning();

  return insertedComment;
}
