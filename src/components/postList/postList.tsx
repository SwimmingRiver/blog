"use client";
import Link from "next/link";
import { useGetPosts } from "@/lib/queries";
import type { Post } from "@/types/post";

const PostList = () => {
  const { data: posts } = useGetPosts();
  return (
    <>
      {posts?.data.map((post: Post) => (
        <article key={post.id} className="py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold mb-2">
            <Link href={`/post/${post.id}`}>{post.title}</Link>
          </h2>
          <p className="text-gray-500 mb-2">
            {new Date(post.created_at).toLocaleDateString("ko-KR")}
          </p>
          <p className="leading-relaxed mb-4">{post.summary}</p>
        </article>
      ))}
    </>
  );
};

export default PostList;
