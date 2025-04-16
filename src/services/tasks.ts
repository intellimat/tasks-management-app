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
