"use client";

import TaskForm from "@/components/taskForm";
import { commentInputValidator } from "@/types/zod";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useShowError } from "@/hooks/useShowError";
import CommentCard from "@/components/commentCard";
import { Button } from "@/components/ui/button";
import useComments from "@/hooks/useComments";
import { Comment } from "@/types/comments";
import { useTask } from "@/hooks/useTask";

export default function TaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params?.id;

  const [isAddingComment, setIsAddingComment] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const { task, taskError, isTaskLoading, handleUpdateTask, handleDeleteTask } =
    useTask(typeof taskId === "string" ? taskId : undefined, () =>
      router.push("/dashboard")
    );

  const {
    comments,
    commentsError,
    areCommentsLoading,
    handleDeleteComment,
    handleEditComment,
    handleNewCommentSubmission: handleNewCommentSubmissionClick,
  } = useComments(setEditingId, taskId);

  useShowError([taskError, commentsError]);

  const resetAddingNewComment = () => {
    setEditedContent("");
    setIsAddingComment(false);
  };

  const handleCommentEditButtonClick = (comment: Comment) => {
    setEditingId(comment.id);
    setEditedContent(comment.content);
  };

  const handlePostCommentButtonClick = async () => {
    const parsedNewComment = commentInputValidator.parse({
      content: editedContent,
    });
    handleNewCommentSubmissionClick(Number(taskId), parsedNewComment);
    resetAddingNewComment();
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
              onSubmit={handleUpdateTask}
              onDelete={handleDeleteTask}
              prefill={task}
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
            <div className="flex flex-col gap-2">
              {isAddingComment && (
                <CommentCard
                  isNew={true}
                  isEditing={true}
                  editedContent={editedContent}
                  setEditedContent={setEditedContent}
                  onPost={handlePostCommentButtonClick}
                  onCancelNew={resetAddingNewComment}
                />
              )}
              {areCommentsLoading ? (
                <p> Loading comments... </p>
              ) : comments?.length === 0 && !isAddingComment ? (
                <p> No comments yet</p>
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
        </div>
      )}
    </main>
  );
}
