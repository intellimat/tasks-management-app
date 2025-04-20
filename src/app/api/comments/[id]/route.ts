import { deleteCommentById, updateComment } from "@/db/dao/comments";
import { commentSchemaValidator, idValidator } from "@/types/zod";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/comments/:id — delete comment
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsedCommentId = idValidator.safeParse(Number(id));

    if (!parsedCommentId.success) {
      return NextResponse.json(
        {
          error: "Invalid Comment Id",
          details: { receivedCommentId: id },
        },
        { status: 400 }
      );
    }

    const deletedCommentFromDB = await deleteCommentById(parsedCommentId.data);

    if (deletedCommentFromDB === null) {
      return NextResponse.json(
        { error: "Comment not found. " },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedCommentFromDB);
  } catch (error) {
    console.error(`DELETE /api/comments/:id error: `, error);
    return NextResponse.json(
      { error: "Failed to delete comment. " },
      { status: 500 }
    );
  }
}

// PUT /api/comments/:id — delete comment
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { id } = await params;
    const parsedCommentId = idValidator.safeParse(Number(id));
    const parsedComment = commentSchemaValidator.safeParse(body);

    if (!parsedCommentId.success) {
      return NextResponse.json(
        {
          error: "Invalid Comment Id",
          details: { receivedCommentId: id },
        },
        { status: 400 }
      );
    }

    if (!parsedComment.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsedComment.error.flatten() },
        { status: 400 }
      );
    }

    const udpatedComment = await updateComment(
      parsedCommentId.data,
      parsedComment.data
    );

    if (udpatedComment === null) {
      return NextResponse.json(
        { error: "Comment not found. " },
        { status: 404 }
      );
    }

    return NextResponse.json(udpatedComment);
  } catch (error) {
    console.error(`PUT /api/comments/:id error: `, error);
    return NextResponse.json(
      { error: "Failed to update comment. " },
      { status: 500 }
    );
  }
}
