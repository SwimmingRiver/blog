"use client";

import { useState, useEffect } from "react";
import { useCreatePost } from "@/lib/mutate";
import { CreatePost } from "@/types/post";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const { mutate: createPost, isSuccess, data: newPost } = useCreatePost();
  const router = useRouter();

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
    if (isSuccess && newPost?.data) {
      router.push(`/post/${newPost.data.id}`);
    }
  }, [isSuccess, newPost, router]);

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Write a New Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col">
          <label htmlFor="title" className="font-semibold mb-2">Title</label>
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
          <label htmlFor="summary" className="font-semibold mb-2">Summary</label>
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
          <label htmlFor="content" className="font-semibold mb-2">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded text-base min-h-52 resize-y"
          />
        </div>
        <button type="submit" className="bg-gray-800 text-white py-3 px-5 rounded text-lg cursor-pointer self-start">
          Create Post
        </button>
      </form>
    </>
  );
}
