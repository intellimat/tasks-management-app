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
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

interface CommentCardProps {
  comment?: Comment;
  isEditing: boolean;
  isNew?: boolean;
  editedContent: string;
  setEditedContent: (content: string) => void;
  onEditButtonClick?: () => void;
  onDelete?: () => void;
  onCancelEditing?: () => void;
  onSave?: (updatedComment: Comment) => void;
  onPost?: () => void;
  onCancelNew?: () => void;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  isEditing,
  isNew = false,
  editedContent,
  setEditedContent,
  onCancelEditing,
  onEditButtonClick,
  onSave,
  onDelete,
  onPost,
  onCancelNew,
}) => {
  const authorName = comment?.author?.name || comment?.author?.email || "You";
  const createdAt = comment?.createdAt || new Date().toISOString();
  const commentContent = comment?.content || "";

  return (
    <div className="border-1 rounded-md p-2">
      <div className="flex items-center mb-2">
        <h4 className="uppercase font-semibold">{authorName}</h4>
        {!isNew && comment && (
          <>
            <span className="mx-5 text-sm">{formatDate(createdAt)}</span>
            <DropdownMenu>
              <DropdownMenuTrigger className="ml-auto">
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={onEditButtonClick}>
                  <Pencil className="text-primary mr-2" size={16} /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete}>
                  <Trash className="stroke-red-800 mr-2" size={16} /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>

      {isEditing || isNew ? (
        <div className="space-y-2">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full"
            placeholder="Write your comment..."
          />
          <div className="flex gap-2">
            {isNew ? (
              <>
                <Button
                  size="sm"
                  onClick={onPost}
                  disabled={!editedContent.trim()}
                >
                  Post
                </Button>
                <Button variant="outline" size="sm" onClick={onCancelNew}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={() =>
                    comment && onSave?.({ ...comment, content: editedContent })
                  }
                >
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={onCancelEditing}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <p>{commentContent}</p>
      )}
    </div>
  );
};

export default CommentCard;
