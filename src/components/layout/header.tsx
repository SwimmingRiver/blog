
import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <h1 className="blog-title">
        <Link href="/">My Tech Blog</Link>
      </h1>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/new-post">New Post</Link>
        <Link href="/about">About</Link>
      </nav>
    </header>
  );
}
