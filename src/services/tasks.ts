import { z } from "zod";
import { fetcher } from "@/lib/fetcher";
import { Task } from "@/types/task";
import { TaskSchemaValidator } from "@/types/zod";

type TaskFormData = z.infer<typeof TaskSchemaValidator>;

export async function createTask(data: TaskFormData) {
  return fetcher<Task>("/api/tasks", {
    method: "POST",
    body: data,
  });
}

export async function deleteTask(taskId: number) {
  return fetcher<{ deletedTask: Task }>(`/api/tasks/${taskId}`, {
    method: "DELETE",
  });
}

export async function updateTask(taskId: number, data: TaskFormData) {
  return fetcher<Task>(`/api/tasks/${taskId}`, {
    method: "PUT",
    body: data,
  });
}
