import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_API_KEY || "";

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase API URL or key");
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}