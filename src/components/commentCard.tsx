import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Ellipsis, Pencil, Trash } from "lucide-react";
import { Comment } from "@/types/comments";
import { formatDate } from "@/lib/datetime";

interface CommentCardProps {
  comment: Comment;
  onEdit: (comment: Comment) => void;
  onDelete: (comment: Comment) => void;
}
const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="border-1 rounded-md p-2">
      <div className="flex items-center mb-2">
        <h4 className="uppercase font-semibold">
          {comment.author.name || comment.author.email}
        </h4>
        <span className="mx-5 text-sm">{formatDate(comment.createdAt)}</span>
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-auto">
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onEdit(comment)}>
              <Pencil className="text-primary" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(comment)}>
              <Trash className="stroke-red-800" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p>{comment.content}</p>
    </div>
  );
};

export default CommentCard;
