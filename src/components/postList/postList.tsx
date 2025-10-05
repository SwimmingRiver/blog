"use client";
import Link from "next/link";
import { getPosts } from "@/lib/queries";
import type { Post } from "@/types/post";

import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github.css";
import ViewStats from "@/components/stats/ViewStats";
import Cookies from "js-cookie";

const PostList = () => {
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const {
    data: postData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", selectedTag],
    queryFn: ({ pageParam }) => getPosts(pageParam, selectedTag),
    initialPageParam: 0,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, allPages) => {
      const currentItemCount = allPages.flatMap((page) => page.data).length;
      return lastPage.count && currentItemCount < lastPage.count
        ? allPages.length
        : undefined;
    },
  });
  const posts = postData?.pages.flatMap((page) => page.data);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Get all unique tags from posts
  const allTags = Array.from(
    new Set(
      posts?.flatMap((post) => post.tags?.map((tag) => tag.name) || []) || []
    )
  ).sort();

  // 블로그 방문 카운트 (24시간 동안 1회만)
  useEffect(() => {
    const cookieName = "site_visited";

    if (!Cookies.get(cookieName)) {
      // 쿠키를 먼저 설정하여 중복 호출 방지
      Cookies.set(cookieName, 'true', { expires: 1 });

      fetch("/api/site/visit", {
        method: "POST",
      }).catch((error) => {
        console.error("Failed to track site visit:", error);
        // 실패 시 쿠키 제거
        Cookies.remove(cookieName);
      });
    }
  }, []);

  useEffect(() => {
    if (!hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="h-full overflow-y-auto space-y-4 ">
      <div className="sticky top-0 bg-white py-4 border-b border-gray-200 mb-4">
        <ViewStats />
        {allTags.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(undefined)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTag === undefined
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTag === tag
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {posts?.map((post: Post) => (
        <article key={post.id} className="py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold mb-2">
            <Link href={`/post/${post.id}`}>{post.title}</Link>
          </h2>
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-500 text-sm">
              {new Date(post.created_at).toLocaleDateString("ko-KR")}
            </p>
            <p className="text-gray-500 text-sm">
              조회수: {post.view_count || 0}
            </p>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          {post.summary && (
            <div className="markdown mb-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.summary}
              </ReactMarkdown>
            </div>
          )}
        </article>
      ))}
      <div ref={loadMoreRef}>
        {isFetchingNextPage && "Loading..."}
        {hasNextPage && "Load more"}
      </div>
    </div>
  );
};

export default PostList;
