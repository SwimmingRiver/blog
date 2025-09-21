"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import AuthButton from "../auth/AuthButton";

export default function NavLinks() {
  const [user, setUser] = useState<User | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <>
      <Link href="/" className="ml-5 text-lg">
        Home
      </Link>
      {user && (
        <>
          <Link href="/new-post" className="ml-5 text-lg">
            New Post
          </Link>
          <AuthButton />
        </>
      )}
      <Link href="/about" className="ml-5 text-lg">
        About
      </Link>
    </>
  );
}
