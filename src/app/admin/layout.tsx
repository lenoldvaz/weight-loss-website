import Link from "next/link";
import { ReactNode } from "react";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/taxonomy", label: "Taxonomy" },
  { href: "/admin/schemas", label: "Schemas" },
  { href: "/admin/content", label: "Content" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-800">
          <p className="text-xs text-gray-500 uppercase tracking-widest">Admin</p>
          <p className="text-sm font-semibold text-white mt-1">weight-loss.ca</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-gray-800">
          <p className="text-xs text-gray-600">Internal tool — do not share</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
