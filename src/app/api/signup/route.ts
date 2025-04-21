import { _fetchUserByEmail, insertUser } from "@/db/dao/users";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  // TODO: validate input with zod

  const fetchedUserFromDB = await _fetchUserByEmail(email);
  if (fetchedUserFromDB !== null) {
    // user already exists!
    return NextResponse.json(
      { error: "Email already in use. " },
      { status: 400 }
    );
  }

  const passwordHash = await hash(password, 10);

  await insertUser({ email, passwordHash });

  return NextResponse.json({ email }, { status: 201 });
}
