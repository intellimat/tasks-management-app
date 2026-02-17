"use client";
import UserAuthForm from "@/components/userAuthForm";
import { UserAuth } from "@/types/zod";
import { signupNewUser } from "@/services/signup";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const handleSignUpFormSubmission = async (userAuth: UserAuth) => {
    try {
      const { email } = await signupNewUser(userAuth.email, userAuth.password);
      toast.success(`User ${email} added successfully!`);
      await signIn("credentials", {
        ...userAuth,
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error(error);
      toast.error("User could not be added. ");
    }
  };

  return (
    <main>
      <div className="w-full md:w-2xl mt-4 md:mx-auto">
        <UserAuthForm
          buttonLabel={"Submit"}
          onSubmit={handleSignUpFormSubmission}
          redirectMessage="Already have an account?"
          redirectButtonLabel={"Login"}
          redirectUrl={"/login"}
        />
      </div>
    </main>
  );
}
