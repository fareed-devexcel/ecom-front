"use client"
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import NavLink from "./navlink";
export default function Header() {
    const { data: session } = useSession();
    const pathname = usePathname();
  
    return (
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        {/* App Title */}
        <h1 className="text-2xl font-bold text-gray-800">My App</h1>
  
        {/* Navigation */}
        <nav className="flex gap-4">
        
          {!session ? (
            <>
            
              <NavLink href="/login" pathname={pathname}>
                Login
              </NavLink>
              <NavLink href="/register" pathname={pathname}>
                Register
              </NavLink>
            </>
          ) : (
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </nav>
      </header>
    );
  }