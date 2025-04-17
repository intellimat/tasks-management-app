"use client";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/types/task";
import TaskCard from "@/components/taskCard";
import CustomDialog from "@/components/customDialog";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetcher";
import { Skeleton } from "@/components/ui/skeleton";
import { useShowError } from "@/hooks/useShowError";
import { createTask, deleteTask } from "@/services/tasks";
import { TaskSchemaValidator } from "@/types/zod";
import { z } from "zod";
import { toast } from "sonner";
import TaskForm from "@/components/taskForm";
import { useState } from "react";
import { getMillisFromHours } from "@/lib/utils";

export default function DashboardPage() {
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const router = useRouter();
  const {
    data: tasks,
    error,
    isLoading,
    mutate,
  } = useSWR<Task[], Error>("/api/tasks", fetcher, { errorRetryCount: 0 });
  useShowError(error);
  const { inProgressTasks, todoTasks, doneTasks, unknownStatusTasks } =
    useTasks(tasks || []);

  const handleDeleteTask = async (taskId: number) => {
    try {
      const { deletedTask } = await deleteTask(taskId);
      mutate(
        (currentTasks = []) => currentTasks.filter((_t) => _t.id !== taskId),
        false
      );
      toast("Task successfully deleted!", {
        duration: 5000,
        dismissible: true,
        description: (
          <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(deletedTask, null, 2)}
            </code>
          </pre>
        ),
      });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred, task could not be deleted. ", {
        duration: 5000,
        dismissible: true,
      });
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

      toast("Task successfully created!", {
        duration: 5000,
        dismissible: true,
        description: (
          <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(createdTask, null, 2)}
            </code>
          </pre>
        ),
      });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred, task could not be created. ", {
        duration: 5000,
        dismissible: true,
      });
    } finally {
      setIsAddTaskDialogOpen(false);
    }
  };

  return (
    <main>
      <div className="flex justify-end py-3 md:py-0">
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
