"use client";

import UserAuthForm from "@/components/userAuthForm";
import { UserAuth } from "@/types/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  async function handleLoginFormSubmission(userAuth: UserAuth) {
    const response = await signIn("credentials", {
      ...userAuth,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (response?.ok) {
      toast.success("Login successful!");
      setIsRedirecting(true);
      if (response.url) {
        router.push(response.url);
      }
    } else if (response?.status === 401) {
      toast.error("Wrong credentials.");
    } else {
      toast.error(response?.error);
    }
  }

  return (
    <div className="w-full md:w-2xl mt-4 md:mx-auto">
      {isRedirecting ? (
        <p> Redirecting to Dashboard page... </p>
      ) : (
        <UserAuthForm
          buttonLabel={"Submit"}
          onSubmit={handleLoginFormSubmission}
          redirectMessage="No account yet?"
          redirectButtonLabel={"Sign Up"}
          redirectUrl={"/signup"}
        />
      )}
    </div>
  );
}
