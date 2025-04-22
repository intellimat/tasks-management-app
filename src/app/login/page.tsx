"use client";

import UserAuthForm from "@/components/userAuthForm";
import { userAuthInputValidator } from "@/types/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

export default function LoginPage() {
  const router = useRouter();

  async function handleLoginFormSubmission(
    userAuth: z.infer<typeof userAuthInputValidator>
  ) {
    const response = await signIn("credentials", {
      ...userAuth,
      redirect: false,
    });

    if (response?.ok) {
      toast.success("Login successful!");
      router.push("/dashboard");
    } else if (response?.status === 401) {
      toast.error("Wrong credentials. ");
    } else {
      toast.error(response?.error);
    }
  }

  return (
    <div className="w-full md:w-2xl mt-4 md:mx-auto">
      <UserAuthForm
        buttonLabel={"Submit"}
        onSubmit={handleLoginFormSubmission}
        redirectMessage="No account yet?"
        redirectButtonLabel={"Sign Up"}
        redirectUrl={"/signup"}
      />
    </div>
  );
}
