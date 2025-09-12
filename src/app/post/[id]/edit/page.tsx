"use client";

import { useState, useEffect } from "react";
import { useGetPost } from "@/lib/queries";
import { useUpdatePost } from "@/lib/mutate";
import { UpdatePost } from "@/types/post";

export default function EditPostPage({ params }: { params: { id: string } }) {
  const { data: post } = useGetPost(params.id);
  const { mutate: updatePost } = useUpdatePost(params.id);

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
    alert("Post updated! Check the console for the data.");
  };

  return (
    <>
      <h1 className="page-title">Edit Post</h1>
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="summary">Summary</label>
          <input
            id="summary"
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Optional summary of your post"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Update Post
        </button>
      </form>
    </>
  );
}
