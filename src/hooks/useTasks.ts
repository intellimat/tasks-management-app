import { getMillisFromHours } from "@/lib/datetime";
import { fetcher } from "@/lib/fetcher";
import { createTask, deleteTask } from "@/services/tasks";
import { Task, TaskStatus } from "@/types/task";
import { TaskFormData } from "@/types/zod";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import useSWR from "swr";

const useTasks = (
  setIsAddTaskDialogOpen: (open: boolean) => void,
  searchWord: string
) => {
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
        if (
          task.status === TaskStatus.InProgress &&
          task.title.toUpperCase().includes(searchWord.toUpperCase())
        ) {
          inProgressTasks.push(task);
        } else if (
          task.status === TaskStatus.Todo &&
          task.title.toUpperCase().includes(searchWord.toUpperCase())
        ) {
          todoTasks.push(task);
        } else if (
          task.status === TaskStatus.Completed &&
          task.title.toUpperCase().includes(searchWord.toUpperCase())
        ) {
          doneTasks.push(task);
        } else if (
          !task.status &&
          task.title.toUpperCase().includes(searchWord.toUpperCase())
        ) {
          unknownStatusTasks.push(task);
        }
      });

      return { inProgressTasks, todoTasks, doneTasks, unknownStatusTasks };
    }, [tasks, searchWord]);

  const handleDeleteTask = async (task: Task) => {
    try {
      const { deletedTask } = await deleteTask(task.id);
      await mutate(
        (currentTasks = []) => currentTasks.filter((_t) => _t.id !== task.id),
        false
      );
      toast.success(`Task "${deletedTask.title}" was successfully deleted!`);
    } catch (error) {
      console.error(error);
      toast.error("Your task could not be deleted.");
    }
  };

  const handleEditTask = (taskId: number) => {
    router.push(`/tasks/${taskId}`);
  };

  const handleNewTaskSubmission = async (data: TaskFormData) => {
    try {
      if (data.timeEstimation) {
        // Transform hours into milliseconds
        data.timeEstimation = getMillisFromHours(data.timeEstimation);
      }
      const createdTask = await createTask(data);
      await mutate(
        (currentTasks = []) => [...currentTasks, createdTask],
        false
      ); // Default currentTasks to [] if undefined

      toast.success(`Task "${createdTask.title}" was successfully created!`);
    } catch (error) {
      console.error(error);
      toast.error("Your task could not be created. ");
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

export default useTasks;
