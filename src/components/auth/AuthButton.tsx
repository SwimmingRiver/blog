"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return <div className="ml-5 text-lg">Loading...</div>;
  }

  if (user) {
    return (
      <div className="ml-5 flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          {user.email}
        </span>
        <button
          onClick={handleSignOut}
          className="text-lg text-red-600 hover:text-red-800"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="ml-5 space-x-4">
      <button
        onClick={() => router.push("/login")}
        className="text-lg text-blue-600 hover:text-blue-800"
      >
        Sign In
      </button>
      <button
        onClick={() => router.push("/signup")}
        className="text-lg text-green-600 hover:text-green-800"
      >
        Sign Up
      </button>
    </div>
  );
}