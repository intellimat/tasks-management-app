import { getHoursFromMillis, getMillisFromHours } from "@/lib/datetime";
import { fetcher } from "@/lib/fetcher";
import { deleteTask, updateTask } from "@/services/tasks";
import { Task } from "@/types/task";
import { TaskFormData } from "@/types/zod";
import { useMemo } from "react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

export const useTask = (
  taskId: string | undefined,
  onMutationSuccess: () => void
) => {
  const {
    data: task,
    error: taskError,
    isLoading: isTaskLoading,
  } = useSWR<Task, Error>(taskId ? `/api/tasks/${taskId}` : null, fetcher, {
    errorRetryCount: 0,
  });

  const parsedTask = useMemo(() => {
    if (!task) {
      return undefined;
    }
    return {
      ...task,
      // Transform milliseconds into hours
      timeEstimation: task.timeEstimation
        ? getHoursFromMillis(task.timeEstimation)
        : undefined,
    };
  }, [task]);

  const handleUpdateTask = async (data: TaskFormData) => {
    try {
      if (!taskId) {
        toast.error("Selected task could not be updated. ");
        return;
      }

      if (data.timeEstimation) {
        // Transform hours into milliseconds
        data.timeEstimation = getMillisFromHours(data.timeEstimation);
      }

      const parsedTaskId = Number(taskId);
      await updateTask(parsedTaskId, data);
      toast.success("Task successfully updated!");
      onMutationSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Selected task could not be updated. ");
    }
  };

  const handleDeleteTask = async () => {
    try {
      if (!task) {
        toast.error("Your task could not be deleted.");
        return;
      }
      const { deletedTask } = await deleteTask(task.id);
      await mutate("/api/tasks");
      toast.success(`Task "${deletedTask.title}" was successfully deleted!`);
      onMutationSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Your task could not be deleted.");
    }
  };

  return {
    task: parsedTask,
    taskError,
    isTaskLoading,
    handleUpdateTask,
    handleDeleteTask,
  };
};
