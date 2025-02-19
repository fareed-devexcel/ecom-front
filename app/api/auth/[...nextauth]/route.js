import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Make request to Express.js API to authenticate user
          const res = await fetch("http://localhost:4000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          const user = await res.json();
          
          if (!res.ok) {
            throw new Error(user.message || "Invalid credentials");
          }

          return { ...user, accessToken: user.token }; // Store the token in session
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken; // Store JWT token
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken; // Pass token to session
      return session;
    },
  },
  pages: {
    signIn: "/login", // Redirect to login page if not authenticated
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
