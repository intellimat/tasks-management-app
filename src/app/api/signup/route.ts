import { _fetchUserByEmail, insertUser } from "@/db/dao/users";
import { userAuthInputValidator } from "@/types/zod";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedUserCredentials = userAuthInputValidator.safeParse(body);

    if (!parsedUserCredentials.success) {
      return NextResponse.json(
        {
          error: "Credentials error",
          details: parsedUserCredentials.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { email, password } = body;

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
  } catch (error) {
    console.error("POST /api/signup error: ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
