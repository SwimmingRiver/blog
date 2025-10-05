"use client";
import { useGetPost } from "@/lib/queries";
import { useDeletePost } from "@/lib/mutate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import Cookies from "js-cookie";

export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: post } = useGetPost(id);
  const { mutate: deletePost } = useDeletePost();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // 조회수 증가 (24시간 동안 1회만)
  useEffect(() => {
    if (id) {
      const cookieName = `viewed_${id}`;

      if (!Cookies.get(cookieName)) {
        // 쿠키를 먼저 설정하여 중복 호출 방지
        Cookies.set(cookieName, 'true', { expires: 1 });

        fetch("/api/views/increment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId: id }),
        }).catch((error) => {
          console.error("Failed to increment view:", error);
          // 실패 시 쿠키 제거
          Cookies.remove(cookieName);
        });
      }
    }
  }, [id]);

  if (!post) {
    return <div>Post not found</div>;
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(id, {
        onSuccess: () => {
          router.push("/");
        },
      });
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <article className="p-5">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-5">{post.data?.title}</h1>
        {user && (
          <div className="flex gap-2">
            <Link href={`/post/${id}/edit`} className="self-center">
              Edit
            </Link>
            <button onClick={handleDelete} className="self-center">
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center mb-5">
        <p className="text-gray-500">
          {new Date(post.data?.created_at || "").toLocaleDateString("ko-KR")}
        </p>
        <p className="text-gray-500">
          조회수: {post.data?.view_count || 0}
        </p>
      </div>
      {post.data?.tags && post.data.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {post.data.tags.map((tag) => (
            <span
              key={tag.id}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
      <div className="markdown">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {post.data?.content || ""}
        </ReactMarkdown>
      </div>
      </article>
    </div>
  );
}
