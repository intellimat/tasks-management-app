import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { _fetchUserByEmail } from "@/db/dao/users";

const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const user = await _fetchUserByEmail(credentials.email);

        if (user === null) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.passwordHash,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 43200, // 12 hours: 12*60*60=43200
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.sub; // Add user ID to session from JWT
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};
export default authConfig;
