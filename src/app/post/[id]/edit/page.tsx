"use client";

import { useState, useEffect } from "react";
import { useGetPost } from "@/lib/queries";
import { useUpdatePost } from "@/lib/mutate";
import { UpdatePost } from "@/types/post";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: post } = useGetPost(id);
  const { mutate: updatePost, isSuccess } = useUpdatePost(id);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (post) {
      setTitle(post.data?.title || "");
      setSummary(post.data?.summary || "");
      setContent(post.data?.content || "");
    }
  }, [post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const postData: UpdatePost = {
      title,
      summary: summary.trim() || null,
      content,
    };

    updatePost(postData);
  };

  useEffect(() => {
    if (isSuccess) {
      router.push(`/post/${id}`);
    }
  }, [isSuccess, id, router]);

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
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
          <label htmlFor="content" className="font-semibold mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded text-base min-h-52 resize-y"
          />
        </div>
        <button
          type="submit"
          className="bg-gray-800 text-white py-3 px-5 rounded text-lg cursor-pointer self-start"
        >
          Update Post
        </button>
      </form>
    </>
  );
}
