"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const items = [
  { href: "/dictionary", label: "Dictionary" },
  { href: "/review", label: "Review" },
  { href: "/zettelkasten", label: "Zettelkasten" },
  { href: "/suggestions", label: "Suggestions" },
  { href: "/settings", label: "Settings" }
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="hidden md:block border-r p-4">
      <nav className="space-y-1">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className={clsx(
              "block rounded-md px-3 py-2 transition",
              path === i.href ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
            )}
          >
            {i.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
