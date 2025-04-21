import { getHoursFromMillis, getMillisFromHours } from "@/lib/datetime";
import { fetcher } from "@/lib/fetcher";
import { updateTask } from "@/services/tasks";
import { Task } from "@/types/task";
import { TaskInputValidator } from "@/types/zod";
import { useMemo } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { z } from "zod";

export const useTask = (
  taskId: string | undefined,
  onUpdateSuccess: () => void
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

  const handleUpdateTask = async (data: z.infer<typeof TaskInputValidator>) => {
    try {
      if (data.timeEstimation) {
        // Transform hours into milliseconds
        data.timeEstimation = getMillisFromHours(data.timeEstimation);
      }
      if (!taskId) {
        return;
      }
      const parsedTaskId = Number(taskId);
      await updateTask(parsedTaskId, data);
      toast.success("Task successfully updated!");
      onUpdateSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Selected task could not be updated. ");
    }
  };

  return {
    task: parsedTask,
    taskError,
    isTaskLoading,
    handleUpdateTask,
  };
};
