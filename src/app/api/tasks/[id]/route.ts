import { NextRequest, NextResponse } from "next/server";
import { idValidator, TaskInputValidator } from "@/types/zod";
import { deleteTask, fetchTaskById, updateTask } from "@/db/dao/tasks";
import { getServerSession } from "next-auth";
import authConfig from "../../auth/[...nextauth]/auth.config";

// GET /api/tasks/:taskId - get a task
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session || !session.user.email || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    const parsedTaskId = idValidator.safeParse(Number(id));

    if (!parsedTaskId.success) {
      return NextResponse.json(
        {
          error: "Invalid taskId",
          details: parsedTaskId.error.flatten(),
        },
        { status: 400 },
      );
    }

    const fetchedTaskFromDB = await fetchTaskById(
      parsedTaskId.data,
      Number(session.user.id),
    );

    // If task is not found, return a 404 response
    if (fetchedTaskFromDB === null) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(fetchedTaskFromDB);
  } catch (error) {
    console.error("GET /api/tasks error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 },
    );
  }
}

// DELETE /api/tasks — delete a task
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session || !session.user.email || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    const parsedTaskId = idValidator.safeParse(Number(id));

    if (!parsedTaskId.success) {
      return NextResponse.json(
        {
          error: "Invalid taskId",
          details: parsedTaskId.error.flatten(),
        },
        { status: 400 },
      );
    }

    const deletedTask = await deleteTask(
      parsedTaskId.data,
      Number(session.user.id),
    );

    if (deletedTask === null) {
      return NextResponse.json(
        { error: "Failed to delete task" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      deletedTask,
    });
  } catch (error) {
    console.error("DELETE /api/tasks error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 },
    );
  }
}
// PUT /api/tasks — update a task
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session || !session.user.email || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();

    const parsedTaskId = idValidator.safeParse(Number(id));
    const parsedTask = TaskInputValidator.safeParse(body);

    if (!parsedTaskId.success) {
      return NextResponse.json(
        {
          error: "Invalid taskId",
          details: parsedTaskId.error.flatten(),
        },
        { status: 400 },
      );
    }

    if (!parsedTask.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsedTask.error.flatten() },
        { status: 400 },
      );
    }

    const updatedTask = await updateTask(
      parsedTaskId.data,
      parsedTask.data,
      Number(session.user.id),
    );

    if (updatedTask === null) {
      return NextResponse.json(
        { error: "Task could not be updated" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      updatedTask,
    });
  } catch (error) {
    console.error("PUT /api/tasks error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 },
    );
  }
}
