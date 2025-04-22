"use client";
import useTasks from "@/hooks/useTasks";
import TaskCard from "@/components/taskCard";
import CustomDialog from "@/components/customDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useShowError } from "@/hooks/useShowError";
import TaskForm from "@/components/taskForm";
import { useState } from "react";
import { Searchbar } from "@/components/searchBar";

export default function DashboardPage() {
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [searchWord, setSearchWord] = useState("");

  const {
    inProgressTasks,
    todoTasks,
    doneTasks,
    unknownStatusTasks,
    error,
    isLoading,
    handleDeleteTask,
    handleEditTask,
    handleNewTaskSubmission,
  } = useTasks(setIsAddTaskDialogOpen, searchWord);

  useShowError([error]);

  return (
    <main>
      <div className="flex justify-end items-center py-3 md:py-1 md:mb-2 gap-2">
        <Searchbar onChange={(e) => setSearchWord(e.target.value)} />
        <CustomDialog
          buttonLabel="Add Task"
          triggerDialogClassName="uppercase"
          dialogTitle={"Add Task"}
          open={isAddTaskDialogOpen}
          onOpenChange={setIsAddTaskDialogOpen}
        >
          <TaskForm onSubmit={handleNewTaskSubmission} />
        </CustomDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 columns-g gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">In progress</h2>
          <div className="[&>*]:mb-4 ">
            {isLoading ? (
              <Skeleton className="w-full h-32 bg-neutral-300" />
            ) : inProgressTasks.length === 0 ? (
              <p>No Tasks in progress</p>
            ) : (
              inProgressTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  className="bg-blue-50 gap-1"
                  badgeClassName="uppercase font-semibold bg-blue-700"
                />
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">To do</h2>
          <div className="[&>*]:mb-4">
            {isLoading ? (
              <Skeleton className="w-full h-32 bg-neutral-300" />
            ) : todoTasks.length === 0 ? (
              <p>No to do tasks</p>
            ) : (
              todoTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  className="bg-gray-100 gap-1"
                  badgeClassName="uppercase font-semibold"
                />
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Done</h2>
          <div className="[&>*]:mb-4">
            {isLoading ? (
              <Skeleton className="w-full h-32 bg-neutral-300" />
            ) : doneTasks.length == 0 ? (
              <p>No done tasks</p>
            ) : (
              doneTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  className="bg-green-50 gap-1"
                  badgeClassName="uppercase font-semibold bg-green-700"
                />
              ))
            )}
          </div>
        </div>
      </div>
      {unknownStatusTasks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Unknown status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 columns-g gap-4">
            {isLoading ? (
              <>
                <Skeleton className="w-full h-32 bg-neutral-300" />
                <Skeleton className="w-full h-32 bg-neutral-300" />
                <Skeleton className="w-full h-32 bg-neutral-300" />
              </>
            ) : (
              unknownStatusTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  className="bg-amber-100 gap-1"
                  badgeClassName="uppercase font-semibold bg-neutral-500"
                />
              ))
            )}
          </div>
        </div>
      )}
    </main>
  );
}
