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
import { useMemo, useState } from "react";
import { useShowError } from "@/hooks/useShowError";
import CommentCard from "@/components/commentCard";
import { Button } from "@/components/ui/button";
import useComments from "@/hooks/useComments";
import { getHoursFromMillis, getMillisFromHours } from "@/lib/datetime";
import { Comment } from "@/types/comments";

export default function TaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params?.id;

  const [isAddingComment, setIsAddingComment] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const {
    data: task,
    error: taskError,
    isLoading: isTaskLoading,
  } = useSWR<Task, Error>(taskId ? `/api/tasks/${taskId}` : null, fetcher, {
    errorRetryCount: 0,
  });

  const {
    comments,
    commentsError,
    areCommentsLoading,
    handleDeleteComment,
    handleEditComment,
  } = useComments(setEditingId, taskId);

  useShowError([taskError, commentsError]);

  const handleCommentEditButtonClick = (comment: Comment) => {
    setEditingId(comment.id);
    setEditedContent(comment.content);
  };

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
      {isTaskLoading ? (
        <p className="text-xl mt-4">Loading current task...</p>
      ) : taskError ? (
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
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => setIsAddingComment(true)}
              >
                Add
              </Button>
            </div>
            {areCommentsLoading ? (
              <p> Loading comments... </p>
            ) : (
              comments?.map((comment) => (
                <CommentCard
                  key={`${taskId}-${comment.id}`}
                  comment={comment}
                  editedContent={editedContent}
                  setEditedContent={setEditedContent}
                  isEditing={editingId === comment.id}
                  onEditButtonClick={() =>
                    handleCommentEditButtonClick(comment)
                  }
                  onDelete={() => handleDeleteComment(comment)}
                  onCancelEditing={() => setEditingId(null)}
                  onSave={handleEditComment}
                />
              ))
            )}
          </div>
        </div>
      )}
    </main>
  );
}
