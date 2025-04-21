import { NextRequest, NextResponse } from "next/server";
import { TaskInputValidator } from "@/types/zod";
import { getServerSession } from "next-auth";
import authConfig from "../auth/[...nextauth]/auth.config";
import { fetchTasks, insertTask } from "@/db/dao/tasks";

// GET /api/tasks — fetch all tasks
export async function GET() {
  try {
    const fetchedTasksFromDB = await fetchTasks();
    return NextResponse.json(fetchedTasksFromDB);
  } catch (error) {
    console.error("GET /api/tasks error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks. " },
      { status: 500 }
    );
  }
}

// POST /api/tasks — create a new task
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    if (!session || !session.user.email || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const parsed = TaskInputValidator.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input. ", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const insertedTask = await insertTask(parsed.data, {
      email: session.user.email,
      userId: Number(session.user.id),
    });

    return NextResponse.json(insertedTask);
  } catch (error) {
    console.error("POST /api/tasks error: ", error);
    return NextResponse.json(
      { error: "Failed to add task. " },
      { status: 500 }
    );
  }
}
