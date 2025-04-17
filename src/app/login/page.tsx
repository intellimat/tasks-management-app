"use client";

import UserAuthForm from "@/components/userAuthForm";
import { userAuthSchemaValidator } from "@/types/zod";
import { signIn } from "next-auth/react";
import { z } from "zod";

export default function LoginPage() {
  async function handleLoginFormSubmission(
    userAuth: z.infer<typeof userAuthSchemaValidator>
  ) {
    await signIn("credentials", {
      ...userAuth,
      redirect: true,
      callbackUrl: "/dashboard",
    });

    // Optional: handle errors via signIn callback
  }

  return (
    <div className="w-full md:w-2xl mt-4 md:mx-auto">
      <UserAuthForm
        buttonLabel={"Submit"}
        onSubmit={handleLoginFormSubmission}
      />
    </div>
  );
}
