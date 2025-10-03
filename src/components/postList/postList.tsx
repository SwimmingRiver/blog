"use client";
import Link from "next/link";
import { getPosts } from "@/lib/queries";
import type { Post } from "@/types/post";

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github.css";
import ViewStats from "@/components/stats/ViewStats";

const PostList = () => {
  const {
    data: postData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) => getPosts(pageParam),
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

  // 블로그 방문 카운트
  useEffect(() => {
    fetch("/api/site/visit", {
      method: "POST",
    }).catch((error) => {
      console.error("Failed to track site visit:", error);
    });
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
