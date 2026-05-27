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

      router.replace("/login");
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
        className="mw-pill-outline h-11 px-5 text-[14px]"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        Sign Out
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(12,10,9,0.32)] px-5">
          <div className="mw-card w-full max-w-[420px] p-6 text-center shadow-[0_24px_80px_rgba(12,10,9,0.14)]">
            <h2 className="mw-display text-[34px] leading-[1.05]">
              Sign out?
            </h2>
            <p className="mt-3 text-[14px] leading-[1.5] text-[var(--mw-body)]">
              You will need to sign in again to access your chats and academic
              workspace.
            </p>

            {message ? (
              <p className="mt-4 text-[14px] text-red-700">{message}</p>
            ) : null}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                className="mw-pill-outline h-11"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="mw-pill-primary h-11 disabled:opacity-55"
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
