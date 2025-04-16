export enum TaskStatus {
  InProgress = "in progress",
  Todo = "to do",
  Completed = "completed",
  NotAvailable = "not available",
}

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  description?: string;
  timeEstimation?: number; // in milliseconds
}
