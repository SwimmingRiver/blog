import Link from "next/link";

import NavLinks from "@/components/layout/NavLinks";

export default function Header() {
  return (
    <header className="py-4 border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          <Link href="/">My Tech Blog</Link>
        </h1>
        <nav className="flex items-center">
          <NavLinks />
        </nav>
      </div>
    </header>
  );
}
