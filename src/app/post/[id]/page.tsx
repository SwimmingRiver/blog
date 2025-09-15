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
    <article className="p-5">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-5">{post.data?.title}</h1>
        <div className="flex gap-2">
          <Link href={`/post/${params.id}/edit`} className="self-center">
            Edit
          </Link>
          <button onClick={handleDelete} className="self-center">
            Delete
          </button>
        </div>
      </div>
      <p className="text-gray-500 mb-5">
        {new Date(post.data?.created_at || "").toLocaleDateString("ko-KR")}
      </p>
      <div className="text-lg leading-loose">{post.data?.content}</div>
    </article>
  );
}

