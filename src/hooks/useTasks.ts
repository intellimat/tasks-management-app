import { Task, TaskStatus } from "@/types/task";
import { useMemo } from "react";

export const useTasks = (tasks: Task[]) => {
  const { inProgressTasks, todoTasks, doneTasks, unknownStatusTasks } =
    useMemo(() => {
      const inProgressTasks: Task[] = [];
      const todoTasks: Task[] = [];
      const doneTasks: Task[] = [];
      const unknownStatusTasks: Task[] = [];

      tasks.forEach((task) => {
        if (task.status === TaskStatus.InProgress) {
          inProgressTasks.push(task);
        } else if (task.status === TaskStatus.Todo) {
          todoTasks.push(task);
        } else if (task.status === TaskStatus.Completed) {
          doneTasks.push(task);
        } else if (!task.status) {
          unknownStatusTasks.push(task);
        }
      });

      return { inProgressTasks, todoTasks, doneTasks, unknownStatusTasks };
    }, [tasks]);

  return { inProgressTasks, todoTasks, doneTasks, unknownStatusTasks };
};
