import authConfig from "@/app/api/auth/[...nextauth]/auth.config";
import { addComment, fetchComments } from "@/db/dao/comments";
import { idValidator, commentSchemaValidator } from "@/types/zod";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/tasks/:taskId/comments — fetch all task comments
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
          details: { receivedTaskId: id },
        },
        { status: 400 }
      );
    }

    const fetchedCommentsFromDB = await fetchComments(parsedTaskId.data);
    return NextResponse.json(fetchedCommentsFromDB);
  } catch (error) {
    console.error(`GET /api/tasks/:taskId/comments error: `, error);
    return NextResponse.json(
      { error: "Failed to fetch comments. " },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authConfig);
    const body = await req.json();

    // Get taskId and authorId to inject in new comment.
    const taskId = (await params).id;
    const authorId = session?.user.id;

    if (!taskId) {
      console.error(`Invalid TaskId: ${taskId}`);
      return NextResponse.json({
        error: "Invalid TaskId ",
        status: 400,
      });
    }

    if (!authorId) {
      console.error(`Invalid authorId ${authorId}`);
      return NextResponse.json({
        error: "No authorId could be retrieved for your new comment. ",
        status: 500,
      });
    }

    const parsedNewCommentData = commentSchemaValidator.safeParse(body);

    const parsedTaskId = idValidator.safeParse(Number(taskId));

    if (!parsedTaskId.success) {
      console.error(parsedNewCommentData.error);
      return NextResponse.json({
        error: "Invalid Task Id. ",
        status: 400,
      });
    }

    if (!parsedNewCommentData.success) {
      console.error(parsedNewCommentData.error);
      return NextResponse.json({
        error: "Invalid New Comment. ",
        details: { receivedComment: body },
        status: 400,
      });
    }

    const insertedComment = await addComment({
      ...parsedNewCommentData.data,
      authorId: Number(authorId),
      taskId: parsedTaskId.data,
    });

    if (insertedComment === null) {
      console.error("New Comment could not be added. ");
      return NextResponse.json({
        error: "Comment could not be added. ",
        status: 500,
      });
    }

    return NextResponse.json(insertedComment);
  } catch (error) {
    console.error(`POST /api/tasks/:taskId/comments error: `, error);
    return NextResponse.json(
      { error: "Failed to add comment. " },
      { status: 500 }
    );
  }
}
