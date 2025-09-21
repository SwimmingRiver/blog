"use client";

import { useState, useEffect } from "react";
import { useCreatePost } from "@/lib/mutate";
import { CreatePost } from "@/types/post";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { mutate: createPost, isSuccess, data: newPost } = useCreatePost();
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const postData: CreatePost = {
      title,
      summary: summary.trim() || null,
      content,
    };

    createPost(postData);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      setLoading(false);
    };

    checkAuth();
  }, [router, supabase.auth]);

  useEffect(() => {
    if (isSuccess && newPost?.data) {
      router.push(`/post/${newPost.data.id}`);
    }
  }, [isSuccess, newPost, router]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-full overflow-y-auto">
      <h1 className="text-3xl font-bold mb-8">Write a New Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col">
          <label htmlFor="title" className="font-semibold mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded text-base"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="summary" className="font-semibold mb-2">
            Summary
          </label>
          <input
            id="summary"
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Optional summary of your post"
            className="p-2 border border-gray-300 rounded text-base"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="content" className="font-semibold">
              Content (Markdown)
            </label>
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              {isPreview ? "Edit" : "Preview"}
            </button>
          </div>
          {isPreview ? (
            <div className="p-4 border border-gray-300 rounded min-h-52 markdown">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {content || "*Preview will appear here...*"}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Write your post in Markdown..."
              className="p-2 border border-gray-300 rounded text-base min-h-52 resize-y font-mono"
            />
          )}
        </div>
        <button
          type="submit"
          className="bg-gray-800 text-white py-3 px-5 rounded text-lg cursor-pointer self-start"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}
