import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_API_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // 전체 게시물의 조회수 합계
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("view_count");

    if (postsError) {
      console.error("Error fetching posts:", postsError);
      return NextResponse.json(
        { error: "Failed to fetch total views" },
        { status: 500 }
      );
    }

    const totalViews = posts?.reduce(
      (sum, post) => sum + (post.view_count || 0),
      0
    ) || 0;

    // 오늘 날짜의 조회수
    const today = new Date().toISOString().split("T")[0];
    const { data: dailyView, error: dailyError } = await supabase
      .from("daily_views")
      .select("total_views")
      .eq("date", today)
      .single();

    if (dailyError && dailyError.code !== "PGRST116") {
      console.error("Error fetching daily views:", dailyError);
    }

    const todayViews = dailyView?.total_views || 0;

    return NextResponse.json({
      totalViews,
      todayViews,
    });
  } catch (error) {
    console.error("Error in stats API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
