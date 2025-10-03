import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_API_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Supabase 함수 호출로 조회수 증가
    const { error } = await supabase.rpc("increment_post_view", {
      post_id: postId,
    });

    if (error) {
      console.error("Error incrementing view:", error);
      return NextResponse.json(
        { error: "Failed to increment view" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in increment view API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
