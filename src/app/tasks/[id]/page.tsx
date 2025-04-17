"use client";

import TaskForm from "@/components/taskForm";
import { updateTask } from "@/services/tasks";
import { TaskSchemaValidator } from "@/types/zod";
import { toast } from "sonner";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Task } from "@/types/task";
import { useMemo } from "react";
import { getHoursFromMillis, getMillisFromHours } from "@/lib/utils";
import { useShowError } from "@/hooks/useShowError";

export default function TaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params?.id;

  const {
    data: task,
    error,
    isLoading,
  } = useSWR<Task, Error>(taskId ? `/api/tasks/${taskId}` : null, fetcher, {
    errorRetryCount: 0,
  });

  useShowError(error);

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

  const handleUpdateTaskSubmission = async (
    data: z.infer<typeof TaskSchemaValidator>
  ) => {
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
      toast("Task successfully updated!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred, selected task could not be updated. ");
    }
  };

  return (
    <main>
      {isLoading ? (
        <p className="text-xl mt-4">Loading current task...</p>
      ) : error ? (
        <p className="text-xl mt-4 text-red-800">
          Error: The task with id:{" "}
          <span className="font-semibold">{taskId}</span> could not be
          retrieved.
        </p>
      ) : (
        <div className="w-full md:w-2xl mt-4 md:mx-auto">
          <TaskForm
            onSubmit={handleUpdateTaskSubmission}
            prefill={parsedTask}
          />
        </div>
      )}
    </main>
  );
}
