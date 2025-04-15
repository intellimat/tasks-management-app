import TaskCard from "@/components/taskCard";
import { useTasks } from "@/hooks/useTasks";
import { Task, TaskStatus } from "@/types/task";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AddTaskDialog from "@/components/addTaskDialog";

const tasks: Task[] = [
  {
    id: 1023,
    title: "Write report",
    status: TaskStatus.InProgress,
    timeEstimation: 7200000, // 2 hours
    author: "Alice Johnson",
    description:
      "Create the quarterly performance report with charts and KPIs.",
  },
  {
    id: 2894,
    title: "Fix bug",
    status: TaskStatus.Todo,
    timeEstimation: 4500000, // 1.25 hours
    author: "David Smith",
    description: "Resolve the login issue on the production environment.",
  },
  {
    id: 3478,
    title: "Plan sprint",
    status: TaskStatus.Completed,
    timeEstimation: 5400000, // 1.5 hours
    author: "Laura Chen",
    description: "Organize tasks and priorities for the upcoming sprint cycle.",
  },
  {
    id: 4512,
    title: "Design logo",
    status: TaskStatus.Todo,
    timeEstimation: 3600000, // 1 hour
    author: "Nina Park",
    description: "Sketch initial concepts for the new product branding.",
  },
  {
    id: 5120,
    title: "Review PR",
    status: TaskStatus.InProgress,
    timeEstimation: 1800000, // 0.5 hours, but we'll adjust it to 1 hour minimum
    author: "Samir Patel",
    description: "Go through the open pull requests and leave feedback.",
  },
  {
    id: 6382,
    title: "Update docs",
    status: TaskStatus.Completed,
    timeEstimation: 5400000, // 1.5 hours
    author: "Emily Wright",
    description:
      "Add usage examples and improve structure in API documentation.",
  },
  {
    id: 7843,
    title: "Deploy app",
    status: TaskStatus.Todo,
    timeEstimation: 12600000, // 3.5 hours
    author: "Michael Lee",
    description: "Prepare deployment scripts and run final pre-launch checks.",
  },
  {
    id: 8096,
    title: "Write tests",
    status: TaskStatus.InProgress,
    timeEstimation: 10800000, // 3 hours
    author: "Anna Torres",
    description: "Implement unit and integration tests for new features.",
  },
  {
    id: 9315,
    title: "Refactor code",
    status: TaskStatus.Completed,
    timeEstimation: 7200000, // 2 hours
    author: "Jamal Brown",
    description:
      "Improve readability and structure of the data processing module.",
  },
  {
    id: 9990,
    title: "Team meeting",
    status: TaskStatus.Todo,
    timeEstimation: 5400000, // 1.5 hours
    author: "Kelly Nguyen",
    description: "Weekly sync-up to discuss project progress and blockers.",
  },
];

export default function DashboardPage() {
  const { inProgressTasks, todoTasks, doneTasks } = useTasks(tasks);

  return (
    <main className="px-6">
      <Breadcrumb className="my-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="flex justify-end py-3 md:py-0">
        <AddTaskDialog
          buttonLabel="Add Task"
          dialogDescription="random description"
          triggerDialogClassName="uppercase"
          dialogTitle={"Add Task"}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 columns-g gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">In progress</h2>
          <div className="[&>*]:mb-4 ">
            {inProgressTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                className="bg-blue-50 gap-1"
                badgeClassName="uppercase font-semibold bg-blue-700"
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">To do</h2>
          <div className="[&>*]:mb-4">
            {todoTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                className="bg-gray-100 gap-1"
                badgeClassName="uppercase font-semibold"
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Done</h2>
          <div className="[&>*]:mb-4">
            {doneTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                className="bg-green-50 gap-1"
                badgeClassName="uppercase font-semibold bg-green-700"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
