"use client";

import UserAuthForm from "@/components/userAuthForm";
import { UserAuth } from "@/types/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function LoginPage() {
  async function handleLoginFormSubmission(userAuth: UserAuth) {
    const response = await signIn("credentials", {
      ...userAuth,
      redirect: false,
    });

    if (response?.ok) {
      toast.success("Login successful!");
      window.location.href = "/dashboard";
    } else if (response?.status === 401) {
      toast.error("Wrong credentials.");
    } else {
      toast.error(response?.error?.toString());
    }
  }

  return (
    <div className="w-full md:w-2xl mt-4 md:mx-auto">
      {
        <UserAuthForm
          buttonLabel={"Submit"}
          onSubmit={handleLoginFormSubmission}
          redirectMessage="No account yet?"
          redirectButtonLabel={"Sign Up"}
          redirectUrl={"/signup"}
        />
      }
    </div>
  );
}
