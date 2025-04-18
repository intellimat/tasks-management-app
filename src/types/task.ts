export enum TaskStatus {
  InProgress = "in progress",
  Todo = "to do",
  Completed = "completed",
}

export interface Task {
  id: number;
  authorId: number;
  title: string;
  status?: TaskStatus;
  description?: string;
  timeEstimation?: number; // in milliseconds
}
