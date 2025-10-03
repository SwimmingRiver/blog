import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_API_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST() {
  try {
    // Supabase 함수 호출로 사이트 방문 증가
    const { error } = await supabase.rpc("increment_site_visit");

    if (error) {
      console.error("Error incrementing site visit:", error);
      return NextResponse.json(
        { error: "Failed to increment site visit" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in site visit API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
