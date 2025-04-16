import { z } from "zod";
import { fetcher } from "@/lib/fetcher";
import { TaskFormSchema } from "@/components/addTaskDialog";
import { Task } from "@/types/task";

type TaskFormData = z.infer<typeof TaskFormSchema>;

export async function createTask(data: TaskFormData) {
  return fetcher<Task>("/api/tasks", {
    method: "POST",
    body: data,
  });
}

export async function deleteTask(taskId: number) {
  return fetcher<Task>(`/api/tasks/${taskId}`, {
    method: "DELETE",
  });
}

export async function updateTask(taskId: number, data: TaskFormData) {
  return fetcher<Task>(`/api/tasks/${taskId}`, {
    method: "PUT",
    body: data,
  });
}
