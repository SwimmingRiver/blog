"use client";
import Link from "next/link";
import { useGetPosts } from "@/lib/queries";
import type { Post } from "@/types/post";

const PostList = () => {
  const { data: posts } = useGetPosts();
  return (
    <>
      {posts?.data.map((post: Post) => (
        <article key={post.id} className="post-preview">
          <h2 className="post-title">
            <Link href={`/post/${post.id}`}>{post.title}</Link>
          </h2>
          <p className="post-meta">
            {new Date(post.created_at).toLocaleDateString("ko-KR")}
          </p>
          <p className="post-description">{post.summary}</p>
        </article>
      ))}
    </>
  );
};

export default PostList;
