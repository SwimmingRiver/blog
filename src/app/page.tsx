import Link from "next/link";

type Post = {
  id: number;
  title: string;
  date: string;
  description: string;
  tags: string[];
};

const posts: Post[] = [
  {
    id: 1,
    title: "First Post",
    date: "2025-09-11",
    description: "This is the first post on my new blog.",
    tags: ["Next.js", "Tailwind CSS"],
  },
  {
    id: 2,
    title: "Second Post",
    date: "2025-09-12",
    description: "This is the second post, exploring more topics.",
    tags: ["TypeScript", "Web Development"],
  },
];

export default function Home() {
  return (
    <div className="container">
      <header className="header">
        <h1 className="blog-title">My Tech Blog</h1>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/new-post">New Post</Link>
          <Link href="/about">About</Link>
        </nav>
      </header>
      <main className="main-content">
        {posts.map((post) => (
          <article key={post.id} className="post-preview">
            <h2 className="post-title">
              <Link href={`/post/${post.id}`}>{post.title}</Link>
            </h2>
            <p className="post-meta">
              {post.date}
            </p>
            <p className="post-description">{post.description}</p>
            <div className="post-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </main>
      <footer className="footer">
        <p>&copy; 2025 My Tech Blog</p>
      </footer>
    </div>
  );
}