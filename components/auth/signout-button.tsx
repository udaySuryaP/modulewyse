"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function SignoutButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignout() {
    setMessage("");
    setIsSigningOut(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        setMessage("Couldn't sign out. Please try again.");
        return;
      }

      router.push("/login");
      router.refresh();
    } catch {
      setMessage("Couldn't sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <>
      <button
        className="inline-flex h-11 items-center justify-center rounded-[12px] border border-white/18 bg-white/10 px-5 font-mono text-[14px] font-medium uppercase tracking-[0.02em] text-white"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        Sign Out
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-5">
          <div className="w-full max-w-[420px] rounded-[12px] border border-white/18 bg-[#101111]/80 p-6 text-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-[28px]">
            <h2 className="text-[28px] font-normal leading-[1.1] tracking-[-0.03em]">
              Sign out?
            </h2>
            <p className="mt-3 text-[14px] leading-[1.45] text-white/72">
              You will need to sign in again to access your chats and academic
              workspace.
            </p>

            {message ? (
              <p className="mt-4 text-[14px] text-red-200">{message}</p>
            ) : null}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                className="h-11 rounded-[12px] border border-white/18 bg-white/10 font-mono text-[14px] font-medium uppercase text-white"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="h-11 rounded-[12px] bg-white font-mono text-[14px] font-medium uppercase text-black disabled:opacity-55"
                disabled={isSigningOut}
                onClick={handleSignout}
                type="button"
              >
                {isSigningOut ? "Signing Out..." : "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
