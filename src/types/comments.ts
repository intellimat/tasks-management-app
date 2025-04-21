import { Author } from "./author";

export interface Comment {
  id: number;
  author: Author;
  content: string;
  createdAt: string;
}
