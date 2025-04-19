export enum TaskStatus {
  InProgress = "in progress",
  Todo = "to do",
  Completed = "completed",
}

interface Author {
  id: number;
  name?: string | null;
  email: string;
}

export interface Task {
  id: number;
  author: Author | null;
  title: string;
  status?: TaskStatus;
  description?: string;
  timeEstimation?: number; // in milliseconds
}
