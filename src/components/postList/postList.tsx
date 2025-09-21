"use client";
import Link from "next/link";
import { getPosts } from "@/lib/queries";
import type { Post } from "@/types/post";

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

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
      {posts?.map((post: Post) => (
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
      <div ref={loadMoreRef}>
        {isFetchingNextPage && "Loading..."}
        {hasNextPage && "Load more"}
      </div>
    </div>
  );
};

export default PostList;
