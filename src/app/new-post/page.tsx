'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const postData = {
      title,
      description,
      tags: tags.split(',').map(tag => tag.trim()),
      content,
    };
    console.log(postData);
    // Here you would typically send the data to a server
    alert('Post submitted! Check the console for the data.');
  };

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
        <h1 className="page-title">Write a New Post</h1>
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
            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
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
          <button type="submit" className="submit-btn">Create Post</button>
        </form>
      </main>
      <footer className="footer">
        <p>&copy; 2025 My Tech Blog</p>
      </footer>
    </div>
  );
}
