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
import { useShowError } from "@/hooks/useShowError";
import CommentCard from "@/components/commentCard";
import { Button } from "@/components/ui/button";
import useComments from "@/hooks/useComments";
import { getHoursFromMillis, getMillisFromHours } from "@/lib/datetime";

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

  const { comments, handleDeleteComment } = useComments(taskId);

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
        <div className="flex flex-col md:flex-row md:gap-12">
          <div className="w-full mt-4">
            <TaskForm
              onSubmit={handleUpdateTaskSubmission}
              prefill={parsedTask}
            />
          </div>
          <div className="w-full pt-2 pb-4">
            <div className="flex justify-between mb-2">
              <h2 className="font-semibold text-xl">Comments</h2>
              <Button variant={"outline"} size={"sm"}>
                Add
              </Button>
            </div>
            {comments?.map((comment) => (
              <CommentCard
                key={`${taskId}-${comment.id}`}
                onEdit={() => {}}
                onDelete={handleDeleteComment}
                comment={comment}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
