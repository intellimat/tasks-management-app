import { getdb } from "..";
import { tasks } from "../schema/tasks";
import { users } from "../schema/users";
import { eq, and } from "drizzle-orm";
import { TaskFormData } from "@/types/zod";

export async function fetchTasks(userId: number) {
  const db = await getdb();
  const rows = await db
    .select({
      taskId: tasks.id,
      title: tasks.title,
      status: tasks.status,
      description: tasks.description,
      timeEstimation: tasks.timeEstimation,
      createdAt: tasks.createdAt,
      authorId: users.id,
      authorEmail: users.email,
    })
    .from(tasks)
    .leftJoin(users, eq(tasks.authorId, users.id))
    .where(eq(tasks.authorId, userId)); // only this user's tasks

  // Shape the result as { ...taskFields, author: { ... } }
  const parsedTasks = rows.map((row) => ({
    id: row.taskId,
    title: row.title,
    status: row.status,
    description: row.description,
    timeEstimation: row.timeEstimation,
    createdAt: row.createdAt,
    author: {
      id: row.authorId,
      email: row.authorEmail,
    },
  }));

  return parsedTasks;
}

export async function fetchTaskById(taskId: number, userId: number) {
  const db = await getdb();
  const rows = await db
    .select({
      taskId: tasks.id,
      title: tasks.title,
      status: tasks.status,
      description: tasks.description,
      timeEstimation: tasks.timeEstimation,
      createdAt: tasks.createdAt,
      authorId: users.id,
      authorEmail: users.email,
    })
    .from(tasks)
    .leftJoin(users, eq(tasks.authorId, users.id))
    .where(and(eq(tasks.id, taskId), eq(tasks.authorId, userId)))
    .limit(1);

  if (rows.length === 0) {
    return null;
  }

  // Shape the result as { ...taskFields, author: { ... } }
  const parsedTasks = rows.map((row) => ({
    id: row.taskId,
    title: row.title,
    status: row.status,
    description: row.description,
    timeEstimation: row.timeEstimation,
    createdAt: row.createdAt,
    author: {
      id: row.authorId,
      email: row.authorEmail,
    },
  }));

  return parsedTasks[0];
}

export async function insertTask(
  task: TaskFormData,
  { email, userId }: { email: string; userId: number },
) {
  const db = await getdb();
  const [newTask] = await db
    .insert(tasks)
    .values({
      ...task,
      authorId: userId, // Add authorId to new task
    })
    .returning();

  if (!newTask) {
    return null;
  }

  // Returned enriched task with Author object
  const enrichedTask = {
    ...newTask,
    author: {
      id: userId,
      email,
    },
  };

  return enrichedTask;
}

export async function deleteTask(taskId: number, userId: number) {
  const db = await getdb();
  const [deletedTask] = await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.authorId, userId)))
    .returning();

  if (!deletedTask) {
    return null;
  }
  return deletedTask;
}

export async function updateTask(
  taskId: number,
  task: TaskFormData,
  userId: number,
) {
  const db = await getdb();
  const [updatedTask] = await db
    .update(tasks)
    .set(task)
    .where(and(eq(tasks.id, taskId), eq(tasks.authorId, userId)))
    .returning();

  if (!updatedTask) {
    return null;
  }
  return updatedTask;
}
