import Link from "next/link";

type Post = {
  id: number;
  title: string;
  date: string;
  content: string;
};

const posts: Post[] = [
  {
    id: 1,
    title: "First Post",
    date: "2025-09-11",
    content: "This is the full content of the first post. It can be longer and contain more details.",
  },
  {
    id: 2,
    title: "Second Post",
    date: "2025-09-12",
    content: "This is the full content of the second post. Exploring more topics in depth.",
  },
];

export default function PostPage({ params }: { params: { id: string } }) {
  const post = posts.find((p) => p.id === parseInt(params.id, 10));

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="container">
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
      <main className="main-content">
        <article className="post">
          <h1 className="post-full-title">{post.title}</h1>
          <p className="post-meta">{post.date}</p>
          <div className="post-content">
            {post.content}
          </div>
        </article>
      </main>
      <footer className="footer">
        <p>&copy; 2025 My Tech Blog</p>
      </footer>
    </div>
  );
}