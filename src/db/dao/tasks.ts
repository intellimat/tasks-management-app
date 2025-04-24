import { db } from "..";
import { tasks } from "../schema/tasks";
import { users } from "../schema/users";
import { eq } from "drizzle-orm";
import { TaskFormData } from "@/types/zod";

export async function fetchTasks() {
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
    .leftJoin(users, eq(tasks.authorId, users.id));

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

export async function fetchTaskById(taskId: number) {
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
    .where(eq(tasks.id, taskId))
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
  { email, userId }: { email: string; userId: number }
) {
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

export async function deleteTask(taskId: number) {
  const [deletedTask] = await db
    .delete(tasks)
    .where(eq(tasks.id, taskId))
    .returning();

  if (!deletedTask) {
    return null;
  }
  return deletedTask;
}

export async function updateTask(taskId: number, task: TaskFormData) {
  const [updatedTask] = await db
    .update(tasks)
    .set(task)
    .where(eq(tasks.id, taskId))
    .returning();

  if (!updatedTask) {
    return null;
  }
  return updatedTask;
}
