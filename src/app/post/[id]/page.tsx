"use client";
import { useGetPost } from "@/lib/queries";
import { useDeletePost } from "@/lib/mutate";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PostPage({ params }: { params: { id: string } }) {
  const { data: post } = useGetPost(params.id);
  const { mutate: deletePost } = useDeletePost();
  const router = useRouter();

  if (!post) {
    return <div>Post not found</div>;
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(params.id, {
        onSuccess: () => {
          router.push("/");
        },
      });
    }
  };

  return (
    <article className="post">
      <div className="flex justify-between">
        <h1 className="post-full-title">{post.data?.title}</h1>
        <div className="flex gap-2">
          <Link href={`/post/${params.id}/edit`} className="self-center">
            Edit
          </Link>
          <button onClick={handleDelete} className="self-center">
            Delete
          </button>
        </div>
      </div>
      <p className="post-meta">
        {new Date(post.data?.created_at || "").toLocaleDateString("ko-KR")}
      </p>
      <div className="post-content">{post.data?.content}</div>
    </article>
  );
}

