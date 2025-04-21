import { fetcher } from "@/lib/fetcher";

export async function signupNewUser(email: string, password: string) {
  return await fetcher<{ email: string }>("/api/signup", {
    method: "POST",
    body: { email, password },
  });
}
