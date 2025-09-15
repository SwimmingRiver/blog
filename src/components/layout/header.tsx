
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center py-4 border-b">
      <h1 className="text-3xl font-bold">
        <Link href="/">My Tech Blog</Link>
      </h1>
      <nav>
        <Link href="/" className="ml-5 text-lg">Home</Link>
        <Link href="/new-post" className="ml-5 text-lg">New Post</Link>
        <Link href="/about" className="ml-5 text-lg">About</Link>
      </nav>
    </header>
  );
}
