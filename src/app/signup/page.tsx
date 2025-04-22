"use client";
import UserAuthForm from "@/components/userAuthForm";
import { z } from "zod";
import { userAuthInputValidator } from "@/types/zod";
import { signupNewUser } from "@/services/signup";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const handleSignUpFormSubmission = async (
    userAuth: z.infer<typeof userAuthInputValidator>
  ) => {
    try {
      const { email } = await signupNewUser(userAuth.email, userAuth.password);
      toast.success(`User ${email} added successfully!`);
      toast.info("Loggin in...");
      const signInResponse = await signIn("credentials", {
        ...userAuth,
        redirect: false,
      });
      if (signInResponse?.ok) {
        router.push("/dashboard");
      } else {
        toast.error(signInResponse?.error);
      }
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
