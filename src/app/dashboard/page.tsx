"use client";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/types/task";
import TaskCard from "@/components/taskCard";
import AddTaskDialog from "@/components/addTaskDialog";
import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import { Skeleton } from "@/components/ui/skeleton";
import { useShowErrors } from "@/hooks/useShowErrors";
import { deleteTask } from "@/services/tasks";

export default function DashboardPage() {
  const {
    data: tasks,
    error,
    isLoading,
  } = useSWR<Task[], Error>("/api/tasks", fetcher, { errorRetryCount: 0 });

  useShowErrors(error);

  const { inProgressTasks, todoTasks, doneTasks } = useTasks(tasks || []);

  const handleDeleteTask = async (taskId: number) => {
    await deleteTask(taskId);
  };
  const handleEditTask = (taskId: number) => {
    // navigate to task page
  };

  return (
    <main>
      <div className="flex justify-end py-3 md:py-0">
        <AddTaskDialog
          buttonLabel="Add Task"
          dialogDescription="random description"
          triggerDialogClassName="uppercase"
          dialogTitle={"Add Task"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 columns-g gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">In progress</h2>
          <div className="[&>*]:mb-4 ">
            {isLoading ? (
              <Skeleton className="w-full h-32 bg-neutral-300" />
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
    </main>
  );
}
