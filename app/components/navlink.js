import Link from "next/link";
export default function NavLink({ href, children, pathname }) {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`relative px-4 py-2 rounded-md hover:text-blue-500 transition ${
          isActive ? "text-blue-500 font-semibold" : "text-gray-700"
        }`}
      >
        {children}
        {isActive && (
          <span className="absolute left-0 right-0 -bottom-1 h-1 bg-blue-500 rounded-full"></span>
        )}
      </Link>
    );
  }
  