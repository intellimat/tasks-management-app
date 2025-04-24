import { NextRequest, NextResponse } from "next/server";
import { idValidator, TaskInputValidator } from "@/types/zod";
import { deleteTask, fetchTaskById, updateTask } from "@/db/dao/tasks";

// GET /api/tasks/:taskId - get a task
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const parsedTaskId = idValidator.safeParse(Number(id));

    if (!parsedTaskId.success) {
      return NextResponse.json(
        {
          error: "Invalid taskId",
          details: parsedTaskId.error.flatten(),
        },
        { status: 400 }
      );
    }

    const fetchedTaskFromDB = await fetchTaskById(parsedTaskId.data);

    // If task is not found, return a 404 response
    if (fetchedTaskFromDB === null) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(fetchedTaskFromDB);
  } catch (error) {
    console.error("GET /api/tasks error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks — create a new task
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const parsedTaskId = idValidator.safeParse(Number(id));

    if (!parsedTaskId.success) {
      return NextResponse.json(
        {
          error: "Invalid taskId",
          details: parsedTaskId.error.flatten(),
        },
        { status: 400 }
      );
    }

    const deletedTask = await deleteTask(parsedTaskId.data);

    if (deletedTask === null) {
      return NextResponse.json(
        { error: "Failed to delete task" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      deletedTask,
    });
  } catch (error) {
    console.error("DELETE /api/tasks error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
// PUT /api/tasks — create a new task
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
        { status: 400 }
      );
    }

    if (!parsedTask.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsedTask.error.flatten() },
        { status: 400 }
      );
    }

    const updatedTask = await updateTask(parsedTaskId.data, parsedTask.data);

    if (updatedTask === null) {
      return NextResponse.json(
        { error: "Task could not be updated" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      updatedTask,
    });
  } catch (error) {
    console.error("PUT /api/tasks error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
