"use client";
import UserAuthForm from "@/components/userAuthForm";
import { z } from "zod";
import { userAuthSchemaValidator } from "@/types/zod";
import { signupNewUser } from "@/services/signup";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const handleSignUpFormSubmission = async (
    userAuth: z.infer<typeof userAuthSchemaValidator>
  ) => {
    try {
      const { email } = await signupNewUser(userAuth.email, userAuth.password);
      toast.success(`User ${email} added successfully!`);
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error(`An error occurred, user could not be added. `);
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
