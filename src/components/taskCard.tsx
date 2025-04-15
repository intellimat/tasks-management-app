import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { Task } from "@/types/task";
import { Badge } from "./ui/badge";
import { getEstimatedTimeHHMM } from "@/lib/utils";
import { Ellipsis, Pencil, Trash } from "lucide-react";
import Link from "next/link";
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
}
export default function TaskCard({ task, className, badgeClassName }: Props) {
  return (
    <Card className={className}>
      <CardHeader className="flex justify-between">
        <CardTitle>{task.title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link
                href={`/tasks/${task.id}?mode=edit`}
                className="flex items-center gap-2"
              >
                <Pencil className="text-primary" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash className="stroke-red-800" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <Badge className={badgeClassName}>{task.status}</Badge>
        <p className="p-0">
          Remaining time:
          <span className="ms-3 font-semibold">
            {getEstimatedTimeHHMM(task.timeEstimation)}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
