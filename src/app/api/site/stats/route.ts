import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_API_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // 전체 누적 방문자 수
    const { data: totalData, error: totalError } = await supabase.rpc(
      "get_total_site_visits"
    );

    if (totalError) {
      console.error("Error fetching total visits:", totalError);
      return NextResponse.json(
        { error: "Failed to fetch total visits" },
        { status: 500 }
      );
    }

    const totalVisitors = totalData || 0;

    // 오늘 날짜의 방문자 수
    const today = new Date().toISOString().split("T")[0];
    const { data: todayVisit, error: todayError } = await supabase
      .from("site_visits")
      .select("total_visits")
      .eq("date", today)
      .single();

    if (todayError && todayError.code !== "PGRST116") {
      console.error("Error fetching today visits:", todayError);
    }

    const todayVisitors = todayVisit?.total_visits || 0;

    return NextResponse.json({
      totalVisitors,
      todayVisitors,
    });
  } catch (error) {
    console.error("Error in site stats API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
