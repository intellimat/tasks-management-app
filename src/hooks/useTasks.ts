import { fetcher } from "@/lib/fetcher";
import { getMillisFromHours } from "@/lib/utils";
import { createTask, deleteTask } from "@/services/tasks";
import { Task, TaskStatus } from "@/types/task";
import { TaskSchemaValidator } from "@/types/zod";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { z } from "zod";

export const useTasks = (setIsAddTaskDialogOpen: (open: boolean) => void) => {
  const router = useRouter();
  const {
    data: tasks,
    error,
    isLoading,
    mutate,
  } = useSWR<Task[], Error>("/api/tasks", fetcher, { errorRetryCount: 0 });

  const { inProgressTasks, todoTasks, doneTasks, unknownStatusTasks } =
    useMemo(() => {
      const inProgressTasks: Task[] = [];
      const todoTasks: Task[] = [];
      const doneTasks: Task[] = [];
      const unknownStatusTasks: Task[] = [];

      tasks?.forEach((task) => {
        if (task.status === TaskStatus.InProgress) {
          inProgressTasks.push(task);
        } else if (task.status === TaskStatus.Todo) {
          todoTasks.push(task);
        } else if (task.status === TaskStatus.Completed) {
          doneTasks.push(task);
        } else if (!task.status) {
          unknownStatusTasks.push(task);
        }
      });

      return { inProgressTasks, todoTasks, doneTasks, unknownStatusTasks };
    }, [tasks]);

  const handleDeleteTask = async (task: Task) => {
    try {
      const { deletedTask } = await deleteTask(task.id);
      mutate(
        (currentTasks = []) => currentTasks.filter((_t) => _t.id !== task.id),
        false
      );
      toast(`Task ${deletedTask.title} was successfully deleted!`);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred, your task could not be deleted.");
    }
  };

  const handleEditTask = (taskId: number) => {
    router.push(`/tasks/${taskId}`);
  };

  const handleNewTaskSubmission = async (
    data: z.infer<typeof TaskSchemaValidator>
  ) => {
    try {
      if (data.timeEstimation) {
        // Transform hours into milliseconds
        data.timeEstimation = getMillisFromHours(data.timeEstimation);
      }
      const createdTask = await createTask(data);
      mutate((currentTasks = []) => [...currentTasks, createdTask], false); // Default currentTasks to [] if undefined

      toast(`Task ${createdTask.title} was successfully created!`);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred, your task could not be created. ");
    } finally {
      setIsAddTaskDialogOpen(false);
    }
  };

  return {
    inProgressTasks,
    todoTasks,
    doneTasks,
    unknownStatusTasks,
    error,
    isLoading,
    handleDeleteTask,
    handleEditTask,
    handleNewTaskSubmission,
  };
};
