import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Redirect to login if not authenticated
  },
});

// Protect routes (only allow authenticated users)
export const config = {
  matcher: ["/"], // Add all protected routes here
};
