import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { Task } from "@/types/task";
import { Badge } from "./ui/badge";
import { getEstimatedTimeHHMM } from "@/lib/utils";
import { Ellipsis, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  task: Task;
  className?: string;
  badgeClassName?: string;
  onDelete: (task: Task) => void;
  onEdit: (taskId: number) => void;
}
export default function TaskCard({
  task,
  className,
  badgeClassName,
  onDelete,
  onEdit,
}: Props) {
  return (
    <Card className={className}>
      <CardHeader className="flex justify-between">
        <CardTitle>{task.title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onEdit(task.id)}>
              <Pencil className="text-primary" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(task)}>
              <Trash className="stroke-red-800" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <Badge className={badgeClassName}>
          {task.status ? task.status : "Unknown status"}
        </Badge>
        <p className="p-0">
          Remaining time:
          <span className="ms-3 font-semibold">
            {task.timeEstimation
              ? getEstimatedTimeHHMM(task.timeEstimation)
              : "N/A"}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
